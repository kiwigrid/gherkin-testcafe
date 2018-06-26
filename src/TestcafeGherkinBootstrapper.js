const fs = require("fs");
const { Parser, Compiler } = require("gherkin");
const TestcafeBootstrapper = require("testcafe/lib/runner/bootstrapper");
const Fixture = require("testcafe/lib/api/structure/fixture");
const Test = require("testcafe/lib/api/structure/test");
const { GeneralError } = require("testcafe/lib/errors/runtime");
const MESSAGE = require("testcafe/lib/errors/runtime/message");
const { supportCodeLibraryBuilder } = require("cucumber");
const testRunTracker = require('testcafe/lib/api/test-run-tracker');

module.exports = class TestcafeGherkinBootstrapper extends TestcafeBootstrapper {
  constructor(...args) {
    super(...args);

    this.stepFiles = [];
    this.specFiles = [];

    this.stepDefinitions = [];

    this.afterHooks = [];
    this.beforeHooks = [];
    this.beforeAllHooks = [];
    this.afterAllHooks = [];
  }

  async _getTests() {
    this._loadStepDefinitions();

    let tests = [];
    const parser = new Parser();
    const compiler = new Compiler();

    this.specFiles.forEach(specFile => {
      const gherkinAst = parser.parse(
        fs.readFileSync(specFile).toString()
      );
      const scenarios = compiler.compile(gherkinAst);

      const testFile = { filename: specFile, collectedTests: [] };
      const fixture = new Fixture(testFile);

      fixture(`Feature: ${gherkinAst.feature.name}`);

      scenarios.forEach(scenario => {
        const test = new Test(testFile);
        test(`Scenario: ${scenario.name}`, async t => {
          let error;
          await this._runHooks(t, this.beforeAllHooks);
          await this._runHooks(t, this._findHook(scenario, this.beforeHooks));

          try {
            for (const step of scenario.steps) {
              await this._resolveAndRunStepDefinition(t, step);
            }
          } catch (e) {
            error = e;
          }

          await this._runHooks(t, this._findHook(scenario, this.afterHooks));
          await this._runHooks(t, this.afterAllHooks);

          if (error) {
            throw error;
          }
        }).page("about:blank");
      });

      tests = [...tests, ...testFile.collectedTests];
    });

    if (this.filter) {
      tests = tests.filter(test =>
        this.filter(test.name, test.fixture.name, test.fixture.path)
      );
    }

    if (!tests.length) {
      throw new GeneralError(MESSAGE.noTestsToRun);
    }

    return tests;
  }

  _loadStepDefinitions() {
    supportCodeLibraryBuilder.reset(process.cwd());
    this.stepFiles.forEach((stepFile) => {
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
      const match = stepDefinition.pattern.exec(step.text);

      if (match) {
        return this._runStep(stepDefinition.code, testController, match.slice(1));
      }
    }

    throw new Error(`Step implementation missing for: ${step.text}`);
  }

  _runStep(step, testController, parameters) {
    const markedFn = testRunTracker.addTrackingMarkerToFunction(testController.testRun.id, step);

    testRunTracker.ensureEnabled();

    return markedFn(testController, ...parameters);
  }


  _findHook(scenario, hooks) {
    const matchedHooks = [];

    hooks.forEach((hook) => {
      scenario.tags.forEach((tag) => {
        if (tag.name === hook.options.tags) {
          matchedHooks.push(hook);
          return false;
        }
      })
    });

    return matchedHooks;
  }

  async _runHooks(testController, hooks) {
    for (const hook of hooks) {
      await this._runStep(hook.code, testController, [])
    }
  }
};
