const { GeneralError } = require('testcafe/lib/errors/runtime');
const { RUNTIME_ERRORS } = require('testcafe/lib/errors/types');
const TestcafeRunner = require('testcafe/lib/runner');

module.exports = class GherkinTestcafeRunner extends TestcafeRunner {
  constructor(...args) {
    super(...args);
    this.apiMethodWasCalled.tags = false;
    this.apiMethodWasCalled.parameterTypeRegistry = false;
  }

  tags(...tags) {
    if (this.apiMethodWasCalled.tags) throw new GeneralError(RUNTIME_ERRORS.multipleAPIMethodCallForbidden, 'tags');

    // remove tags from previous runs (if starting multiple runs in a row in the same process)
    const tagsIndex = process.argv.findIndex(val => val === '--tags');
    if (tagsIndex !== -1) {
      process.argv.splice(tagsIndex, 2);
    }

    tags = this._prepareArrayParameter(tags);

    process.argv.push('--tags', tags.join(','));

    return this;
  }

  parameterTypeRegistryFile(parameterTypeRegistryFilePath) {
    if (this.apiMethodWasCalled.parameterTypeRegistry)
      throw new GeneralError(RUNTIME_ERRORS.multipleAPIMethodCallForbidden, 'parameterTypeRegistry');

    process.argv.push('--param-type-registry-file', parameterTypeRegistryFilePath);
    this.apiMethodWasCalled.parameterTypeRegistry = true;

    return this;
  }
};
