import Testcafe from 'testcafe/lib/testcafe';
import TestcafeGherkinRunner from './TestcafeGherkinRunner';

export default class TestcafeGherkin extends Testcafe {
  createRunner() {
    const newRunner = new TestcafeGherkinRunner(this.proxy, this.browserConnectionGateway);

    this.runners.push(newRunner);

    return newRunner;
  }
}
