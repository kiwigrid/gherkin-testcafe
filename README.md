# gherkin-testcafe

> Run testcafe tests with gherkin syntax

### Authors

* Wilhelm Behncke - behncke@sitegeist.de (original author)
* Lukas Kullmann

This package is inspired by [helen-dikareva/testcafe-cucumber-demo](https://github.com/helen-dikareva/testcafe-cucumber-demo).
The test example for the google search is taken from there.

### Support

Currently, this tool is still under development and very likely to break.

## Why?

[DevExpress](https://github.com/DevExpress)' [testcafe](http://devexpress.github.io/testcafe/) is an amazing tool for writing acceptance tests. Unfortunately it currently lacks support for
BDD-style tests using the famous [gherkin](https://github.com/cucumber/cucumber/wiki/Gherkin) Syntax (Although there seem to be [plans for future support](https://github.com/DevExpress/testcafe/issues/1373#issuecomment-291526857)).

This tool provides a setup in which gherkin `*.feature` specs can be used to run testcafe tests.

## What does this do?

The tool glues testcafe and gherkin together.

It uses testcafe as the testrunner and constructs the `fixture` and `test` calls from gherkin sources during runtime.

Since this tool digs deep into the internals of testcafe to run the feature files, it should only be used together with the testcafe version specified in the peer dependencies of this package.

To interpret `*.feature` files written in gherkin, it uses the `gherkin` package from npm. To allow custom step definitions it uses the `cucumber-expressions` package from npm. Both of those packages are provided by the cucumber project.

## Installation

With npm:

```sh
npm install --save-dev gherkin-testcafe
```

With yarn:

```sh
yarn add --dev gherkin-testcafe
```

## Usage with CLI

Take a look at the `examples/` folder in this repo, to get an idea of how to write gherkin specs and step definitions.

Example:
```sh
gherkin-testcafe --specs ./tests/**/*.feature --steps ./tests/**/*.js --browers chromium firefox
```

### Supported Parameters

`--specs [list of file patterns]` - One or more paths or glob patterns to the `*.feature` files to be tested.

`--steps [list of file patterns]` - One or more paths or glob patterns to the `*.js` files containing the step definitions.

`--browsers` - A space-separated list of browsers to run the tests in (see [Testcafe Browser Support](http://devexpress.github.io/testcafe/documentation/using-testcafe/common-concepts/browsers/browser-support.html#locally-installed-browsers))

`--ports` - Up to 2 ports that will be used by testcafe to serve tested webpages

## Usage with docker

1. Start up the container for the test runner
```sh
docker run --name testrunner -v $(pwd)/specs:/test/specs sitegeist/gherkin-testcafe
```

2. Execute the tests
```sh
docker exec testrunner gherkin-testcafe --specs ./specs/**/*.feature --steps ./specs/**/*.js --browsers firefox
```

3. Clean up
```sh
docker kill testrunner
docker rm testrunner
```

All parameters of the command line interface can be used, but the the list of browsers is limited to:

- firefox
- "chromium --no-sandbox"

## Programming Interface

Similarly to testcafe itself, this extension can be use a programming interface for fine-grained control over the test run.
Most parts of the workflow stay the same.
You only not import `testcafe`, you import `gherkin-testcafe`:

```diff
- const createTestCafe = require('testcafe');
+ const createTestCafe = require('gherkin-testcafe');
```

And for the runner instance, you do not add files (via the `src` method), you add `specs` and `steps`:

```diff
  runner
-     .src('tests/myFixture.js')
+     .specs('./specs/**/*.feature')
+     .steps('./specs/**/*.js')
      .browsers([remoteConnection, 'chrome'])
      .reporter('json')
      .run()
      .then(failedCount => {
          /* ... */
      })
      .catch(error => {
          /* ... */
      });
```

You can add multiple spec and step paths by either passing an array to `specs` and `steps` or by calling these methods multiple times.

```js
runner
    .specs(['./one-path/**/*.feature', './other-path/**/*.feature'])
    
// or

runner
    .specs('./one-path/**/*.feature')
    .specs('./other-path/**/*.feature')
```  
  
All functionality of the main testcafe programming interface is proxied to this implementation.
          
Refer to the [testcafe programming interface help page](https://devexpress.github.io/testcafe/documentation/using-testcafe/programming-interface/) for more information about other parameters.

## Writing step definitions

With the `--steps` parameter you can specify where to find your step definitions.
Step definitions are written with [cucumber-js](https://github.com/cucumber/cucumber-js) with a little tweak of the input parameters.

```js
const { Given } = require('cucumber');

Given(/^I have a step definition with parameter (.+) and another parameter (.+)$/, async (t, param1, param2) => {
    // Test implementation here
});
```

Refer to the [API reference](https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/api_reference.md) for more information on how to set up step definitions.

In contrast to `cucumber-js`, the first parameter of the step implementation is testcafe's test controller.
All other arguments will be the values of the regular expression's captured parentheses.

## Hooks
If you want to use hooks, please refer to the [documentation](https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/hooks.md) of the Cucumber-js. Also, please note that multiple tags per hook definition are not supported.


## License

see [LICENSE.md](./LICENSE.md)
