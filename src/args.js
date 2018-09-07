module.exports = require('yargs')
  .option('browsers', {
    alias: 'b',
    default: ['chrome:headless'],
    describe: 'List of browsers to test in with testcafe',
    type: 'array'
  })
  .option('ports', {
    alias: 'p',
    default: [1337, 1338],
    describe: 'Ports that will be used to serve tested webpages',
    type: 'array'
  })
  .option('specs', {
    alias: 's',
    default: './Specs/Features/**/*.feature',
    describe: 'Path(s) or Pattern(s) leading to your specification files',
    type: 'array'
  })
  .option('steps', {
    alias: 'd',
    default: './Specs/Definitions/**/*.js',
    describe: 'Path(s) or Pattern(s) leading to your step definition files',
    type: 'array'
  })
  .option('skipJsErrors', {
    alias: 'e',
    default: false,
    describe: 'Make tests not fail when a JS error happens on a page',
    type: 'boolean'
  })
  .option('disablePageReloads', {
    default: false,
    describe: 'Disable page reloads between tests',
    type: 'boolean'
  })
  .option('quarantineMode', {
    alias: 'q',
    default: false,
    describe: 'Enable the quarantine mode',
    type: 'boolean'
  })
  .option('debugMode', {
    default: false,
    describe: 'Execute test steps one by one pausing the test after each step',
    type: 'boolean'
  })
  .option('debugOnFail', {
    default: false,
    describe: 'Enter debug mode when the test fails',
    type: 'boolean'
  })
  .option('speed', {
    default: 1,
    describe: 'Set the speed of test execution (0.01 ... 1)',
    type: 'number'
  })
  .option('concurrency', {
    alias: 'c',
    default: 1,
    describe: 'Specifies that tests should run concurrently',
    type: 'number'
  });
