// require stack-chain here to prevent testcafe from loading stack-chain
// Same error as
// https://github.com/DevExpress/testcafe/issues/2166
import 'stack-chain';

import setupExitHook from 'async-exit-hook';
import endpointUtils from 'endpoint-utils';
import { GeneralError } from 'testcafe/lib/errors/runtime';
import MESSAGE from 'testcafe/lib/errors/runtime/message';
import TestcafeGherkin from './TestcafeGherkin';

// Validations
async function getValidHostname(hostname) {
  if (hostname) {
    const valid = await endpointUtils.isMyHostname(hostname);

    if (!valid) throw new GeneralError(MESSAGE.invalidHostname, hostname);
  } else hostname = endpointUtils.getIPAddress();

  return hostname;
}

async function getValidPort(port) {
  if (port) {
    const isFree = await endpointUtils.isFreePort(port);

    if (!isFree) throw new GeneralError(MESSAGE.portIsNotFree, port);
  } else port = await endpointUtils.getFreePort();

  return port;
}

export default async (hostname, port1, port2) => {
  [hostname, port1, port2] = await Promise.all([getValidHostname(hostname), getValidPort(port1), getValidPort(port2)]);

  const testcafe = new TestcafeGherkin(hostname, port1, port2);

  setupExitHook(cb => testcafe.close().then(cb));

  return testcafe;
};
