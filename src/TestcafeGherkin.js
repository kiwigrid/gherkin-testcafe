const Testcafe = require("testcafe/lib/testcafe");
const TestcafeGherkinRunner = require('./TestcafeGherkinRunner');

module.exports = class TestcafeGherkin extends Testcafe {
  createRunner() {
    const newRunner = new TestcafeGherkinRunner(
      this.proxy,
      this.browserConnectionGateway
    );

    this.runners.push(newRunner);

    return newRunner;
  }
}