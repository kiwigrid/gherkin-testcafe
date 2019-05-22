const fs = require('fs');
const gherkin = require('gherkin');
const Fixture = require('testcafe/lib/api/structure/fixture');
const Test = require('testcafe/lib/api/structure/test');
const { GeneralError } = require('testcafe/lib/errors/runtime');
const { RUNTIME_ERRORS } = require('testcafe/lib/errors/types');
const { supportCodeLibraryBuilder } = require('cucumber');
const dataTable = require('cucumber/lib/models/data_table');
const testRunTracker = require('testcafe/lib/api/test-run-tracker');

const getTags = () => {
  const tagsIndex = process.argv.findIndex(val => val === '--tags');

  if (tagsIndex !== -1) {
    return process.argv[tagsIndex + 1].split(',');
  }

  return [];
};

module.exports = class GherkinTestcafeCompiler {
  constructor(sources) {
    this.stepFiles = sources.filter(source => source.substr(-3) === '.js');
    this.specFiles = sources.filter(source => source.substr(-8) === '.feature');

    this.stepDefinitions = [];

    this.afterHooks = [];
    this.beforeHooks = [];
    this.beforeAllHooks = [];
    this.afterAllHooks = [];

    this.tags = getTags();
  }

  streamToArray(readableStream) {
    return new Promise((resolve, reject) => {
      const items = [];
      readableStream.on('data', items.push.bind(items));
      readableStream.on('error', reject);
      readableStream.on('end', () => resolve(items));
    });
  }

  async getTests() {
    this._loadStepDefinitions();

    let tests = await Promise.all(
      this.specFiles.map(async specFile => {
        const gherkinResult = await this.streamToArray(gherkin.fromPaths([specFile]));

        const testFile = { filename: specFile, collectedTests: [] };
        const fixture = new Fixture(testFile);

        fixture(`Feature: ${gherkinResult[1].gherkinDocument.feature.name}`)
          .before(ctx => this._runFeatureHooks(ctx, this.beforeAllHooks))
          .after(ctx => this._runFeatureHooks(ctx, this.afterAllHooks));

        gherkinResult[1].gherkinDocument.feature.children.forEach(child => {
          const scenario = child.scenario;
          if (!this._shouldRunScenario(scenario)) {
            return;
          }

          const test = new Test(testFile);
          test(`Scenario: ${scenario.name}`, async t => {
            let error;

            try {
              for (const step of scenario.steps) {
                await this._resolveAndRunStepDefinition(t, step);
              }
            } catch (e) {
              error = e;
            }

            if (error) {
              throw error;
            }
          })
            .page('about:blank')
            .before(t => this._runHooks(t, this._findHook(scenario, this.beforeHooks)))
            .after(t => this._runHooks(t, this._findHook(scenario, this.afterHooks)));
        });

        return testFile.collectedTests;
      })
    );

    tests = tests.reduce((agg, cur) => agg.concat(cur));

    if (this.filter) {
      tests = tests.filter(test => this.filter(test.name, test.fixture.name, test.fixture.path));
    }

    if (!tests.length) {
      throw new GeneralError(RUNTIME_ERRORS.noTestsToRun);
    }

    return tests;
  }

  _loadStepDefinitions() {
    supportCodeLibraryBuilder.reset(process.cwd());
    this.stepFiles.forEach(stepFile => {
      delete require.cache[require.resolve(stepFile)];

      require(stepFile);
    });

    const finalizedStepDefinitions = supportCodeLibraryBuilder.finalize();
    this.afterHooks = finalizedStepDefinitions.afterTestCaseHookDefinitions;
    this.afterAllHooks = finalizedStepDefinitions.afterTestRunHookDefinitions;
    this.beforeHooks = finalizedStepDefinitions.beforeTestCaseHookDefinitions;
    this.beforeAllHooks = finalizedStepDefinitions.beforeTestRunHookDefinitions;
    this.stepDefinitions = finalizedStepDefinitions.stepDefinitions;
  }

  _resolveAndRunStepDefinition(testController, step) {
    for (const stepDefinition of this.stepDefinitions) {
      const [isMatched, parameters, table] = this._shouldRunStep(stepDefinition, step);
      if (isMatched) {
        return this._runStep(stepDefinition.code, testController, parameters, table);
      }
    }

    throw new Error(`Step implementation missing for: ${step.text}`);
  }

  _runStep(step, testController, parameters, table) {
    const markedFn = testRunTracker.addTrackingMarkerToFunction(testController.testRun.id, step);

    testRunTracker.ensureEnabled();

    return markedFn(testController, parameters, table);
  }

  _findHook(scenario, hooks) {
    return hooks.filter(hook => !hook.options.tags || scenario.tags.find(tag => tag.name === hook.options.tags));
  }

  async _runHooks(testController, hooks) {
    for (const hook of hooks) {
      await this._runStep(hook.code, testController, []);
    }
  }

  async _runFeatureHooks(fixtureCtx, hooks) {
    for (const hook of hooks) {
      await hook.code(fixtureCtx);
    }
  }

  _shouldRunScenario(scenario) {
    return (
      this._scenarioHasAnyOfTheTags(scenario, this._getIncludingTags(this.tags)) &&
      this._scenarioLacksTags(scenario, this._getExcludingTags(this.tags))
    );
  }

  _shouldRunStep(stepDefinition, step) {
    if (typeof stepDefinition.pattern === 'string') {
      return [stepDefinition.pattern === step.text, [], step.dataTable];
    } else if (stepDefinition.pattern instanceof RegExp) {
      const match = stepDefinition.pattern.exec(step.text);
      return [Boolean(match), match ? match.slice(1) : [], step.dataTable];
    }

    const stepType = step.text instanceof Object ? step.text.constructor.name : typeof step.text;

    throw new Error(`Step implementation invalid. Has to be a string or RegExp. Received ${stepType}`);
  }

  _getIncludingTags(tags) {
    return tags.filter(tag => !tag.startsWith('~'));
  }

  _getExcludingTags(tags) {
    return tags.filter(tag => tag.startsWith('~')).map(tag => tag.slice(1));
  }

  _scenarioHasAnyOfTheTags(scenario, tags) {
    return !tags.length || tags.some(tag => scenario.tags.map(t => t.name).includes(tag));
  }

  _scenarioLacksTags(scenario, tags) {
    return !tags.length || !this._scenarioHasAnyOfTheTags(scenario, tags);
  }

  static getSupportedTestFileExtensions() {
    return ['.js', '.feature'];
  }

  static cleanUp() {}
};
