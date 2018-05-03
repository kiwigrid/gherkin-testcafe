const fs = require('fs');
const { Parser } = require("gherkin");
const TestcafeBootstrapper = require("testcafe/lib/runner/bootstrapper");
const Fixture = require("testcafe/lib/api/structure/fixture");
const Test = require("testcafe/lib/api/structure/test");
const { GeneralError } = require("testcafe/lib/errors/runtime");
const MESSAGE = require("testcafe/lib/errors/runtime/message");
const StepDefinitionRegistry = require("./StepDefinitionRegistry");

module.exports = class TestcafeGherkinBootstrapper extends TestcafeBootstrapper {
  constructor(...args) {
    super(...args);

    this.stepDefinitionRegistry = new StepDefinitionRegistry();

    this.specFiles = [];
  }

  async _getTests() {
    let tests = [];

    this.specFiles.forEach(specFile => {
      const gherkinAst = new Parser().parse(
        fs.readFileSync(specFile).toString()
      );

      const testFile = { filename: specFile, collectedTests: [] };
      const fixture = new Fixture(testFile);

      fixture(`Feature: ${gherkinAst.feature.name}`);

      gherkinAst.feature.children.forEach(scenario => {
        const test = new Test(testFile);
        test(`Scenario: ${scenario.name}`, t =>
          Promise.all(
            scenario.steps.map(step =>
              this._resolveAndRunStepDefinition(t, step)
            )
          )).page('about:blank');
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

  async _resolveAndRunStepDefinition(testController, step) {
    const { expression, implementation } = this.stepDefinitionRegistry.resolve(
      step.keyword.toLowerCase().trim(),
      step.text
    );

    if (expression && implementation) {
      return implementation(
        testController,
        ...expression.match(step.text).map(match => match.getValue())
      );
    } else {
      console.warn(`Step implementation missing for: ${step.text}`);
    }
  }
}
