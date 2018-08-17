const createTestCafe = require("./createTestcafeGherkin");

module.exports = async ({
  hostname = "localhost",
  browsers,
  ports,
  specs,
  steps,
  skipJsErrors,
  disablePageReloads,
  quarantineMode,
  debugMode,
  debugOnFail,
  speed
}) => {
  const testcafe = await createTestCafe(hostname, ...ports.slice(0, 2));
  const runner = testcafe.createRunner();

  try {
    const failedCount = await runner
      .browsers(browsers)
      .specs(specs)
      .steps(steps)
      .run({skipJsErrors, disablePageReloads, quarantineMode, debugMode, debugOnFail, speed});

    process.exit(failedCount && 1);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
