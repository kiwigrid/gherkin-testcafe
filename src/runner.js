const createTestCafe = require('./createTestcafeGherkin');

module.exports = async ({
  hostname = 'localhost',
  browsers,
  ports,
  specs,
  steps,
  skipJsErrors,
  disablePageReloads,
  quarantineMode,
  debugMode,
  debugOnFail,
  speed,
  concurrency,
  app,
  appInitDelay,
  tags
}) => {
  const testcafe = await createTestCafe(hostname, ...ports.slice(0, 2));
  const runner = testcafe.createRunner();

  console.log("Running with browsers", browsers, "tags", tags, "concurrency", concurrency);

  try {
    const failedCount = await runner
      .browsers(browsers)
      .specs(specs)
      .steps(steps)
      .concurrency(concurrency)
      .startApp(app, appInitDelay)
      .tags(tags)
      .run({ skipJsErrors, disablePageReloads, quarantineMode, debugMode, debugOnFail, speed });

    process.exit(failedCount && 1);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
