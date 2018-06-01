const glob = require("glob");
const path = require("path");
const TestcafeRunner = require("testcafe/lib/runner/index");
const TestcafeGherkinBootstrapper = require("./TestcafeGherkinBootstrapper");

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
      ...this._loadPaths(specs)
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
    this.bootstrapper.stepFiles = [
      ...this.bootstrapper.stepFiles,
      ...this._loadPaths(steps)
    ];

    return this;
  }

  _loadPaths(paths) {
    return (Array.isArray(paths) ? paths : [paths])
      .map(path => glob.sync(path))
      .reduce((accumulator, resolvedPaths) => [
        ...accumulator,
        ...resolvedPaths
      ])
      .map(resolvedPath => path.join(process.cwd(), resolvedPath));
  }
};
