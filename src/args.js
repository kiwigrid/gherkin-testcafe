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
  .option('skipUncaughtErrors', {
    alias: 'u',
    default: false,
    describe:
      'Defines whether to continue running a test after an uncaught error or unhandled promise rejection occurs on the server',
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
  .option('stopOnFirstFail', {
    alias: 'sf',
    default: false,
    describe: 'Defines whether to stop a test run if a test fails',
    type: 'boolean'
  })
  .option('selectorTimeout', {
    default: 10000,
    describe:
      'Specifies the time (in milliseconds) within which selectors make attempts to obtain a node to be returned',
    type: 'number'
  })
  .option('assertionTimeout', {
    default: 3000,
    describe:
      'Specifies the time (in milliseconds) within which TestCafe makes attempts to successfully execute an assertion',
    type: 'number'
  })
  .option('pageLoadTimeout', {
    default: 3000,
    describe: 'Specifies the time (in milliseconds) TestCafe waits for the window.load event to fire',
    type: 'number'
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
  })
  .option('app', {
    alias: 'a',
    default: null,
    describe:
      'Executes the specified shell command before running tests. Use it to launch or deploy the application you are going to test.'
  })
  .option('appInitDelay', {
    default: 0,
    describe:
      'Specifies the time (in milliseconds) allowed for an application launched using the --app option to initialize.',
    type: 'number'
  })
  .option('tags', {
    alias: 't',
    default: [],
    describe: 'Run only tests having the specified tags',
    type: 'array'
  })
  .option('proxy', {
    default: null,
    describe: 'Specifies the proxy server used in your local network to access the Internet.',
    type: 'string'
  });
