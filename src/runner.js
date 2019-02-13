const { GeneralError } = require('testcafe/lib/errors/runtime');
const MESSAGE = require('testcafe/lib/errors/runtime/message');
const TestcafeRunner = require('testcafe/lib/runner');

module.exports = class GherkinTestcafeRunner extends TestcafeRunner {
  constructor(...args) {
    super(...args);

    this.apiMethodWasCalled.tags = false;
  }

  tags(...tags) {
    if (this.apiMethodWasCalled.tags) throw new GeneralError(MESSAGE.multipleAPIMethodCallForbidden, 'tags');

    tags = this._prepareArrayParameter(tags);

    process.argv.push('--tags', tags.join(','));

    return this;
  }
};
