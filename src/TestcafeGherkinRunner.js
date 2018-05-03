const glob = require("glob");
const path = require("path");
const TestcafeRunner = require("testcafe/lib/runner/index");
const TestcafeGherkinBootstrapper = require('./TestcafeGherkinBoostrapper');

module.exports = class TestcafeGherkinRunner extends TestcafeRunner {
  constructor(proxy, browserConnectionGateway) {
    super(proxy, browserConnectionGateway);

    this.bootstrapper = new TestcafeGherkinBootstrapper(
      browserConnectionGateway
    );
  }

  /**
   * @override
   */
  src() {
    throw new Error("Do not use src method, use spec and step methods instead");
  }

  /**
   * Add one or more feature files to the test run
   * The specs may have the same pattern format that is used for the CLI runner
   * @param {string | string[]} specs
   * @returns {TestcafeGherkinRunner}
   */
  specs(specs) {
    this.bootstrapper.specFiles = [
      ...this.bootstrapper.specFiles,
      ...(Array.isArray(specs) ? specs : [specs])
        .map(specPath => glob.sync(specPath))
        .reduce((accumulator, resolvedPaths) => [
          ...accumulator,
          ...resolvedPaths
        ])
        .map(specPath => path.join(process.cwd(), specPath))
    ];

    return this;
  }

  /**
   * Add one or more step files to the test run
   * The steps may have the same pattern format that is used for the CLI runner
   * @param {string | string[]} steps
   * @returns {TestcafeGherkinRunner}
   */
  steps(steps) {
    const resolvedStepPaths = (Array.isArray(steps) ? steps : [steps])
      .map(stepPath => glob.sync(stepPath))
      .reduce((accumulator, resolvedPaths) => [
        ...accumulator,
        ...resolvedPaths
      ])
      .map(specPath => path.join(process.cwd(), specPath));

    resolvedStepPaths.forEach(stepPath => {
      this.bootstrapper.stepDefinitionRegistry.load(require(stepPath));
    });

    return this;
  }
}
