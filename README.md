# gherkin-testcafe

> Run testcafe tests with gherkin syntax

## What it does

[TestCafé](https://devexpress.github.io/testcafe/) is a tool to write tool to automate end-to-end test fo websites.
This package provides a compatibility layer to support of BDD-style tests to be run with TestCafé using the [Gherkin syntax](https://docs.cucumber.io/gherkin/).
Please note that [there seems to be a plan](https://github.com/DevExpress/testcafe/issues/1373#issuecomment-291526857) to officially support Gherkin syntax in TestCafé.
Once official support is established, this package will be abandoned.

## Installation

Install `gherkin-testcafe` and `cucumber`<sup>1</sup> via npm or yarn:

    npm i gherkin-testcafe cucumber
    
or

    yarn add gherkin-testcafe cucumber

<sup>1</sup> This package internally uses [Cucumber.js](https://github.com/cucumber/cucumber-js) to parse step definitions.
You will need it to define steps (see [Writing step definitions](#writing-step-definitions)).

## CLI usage

Use the `gherkin-testcafe` package to run test via CLI:

    gherkin-testcafe --steps tests/**/*.js --specs tests/**/*.feature --browsers firefox
    
You can use shorthands:
    
    gherkin-testcafe -d tests/**/*.js -s tests/**/*.feature -b firefox

Out of [TestCafé's CLI options](https://devexpress.github.io/testcafe/documentation/using-testcafe/command-line-interface.html#options) a limited amount are supported for this package.

The following options are supported:

| Option | Shorthand | Required |Description | Default
| --- | ---| --- | --- | --- | 
| specs | s | **Required** | A space separated list of feature files to run.We use [glob](https://github.com/isaacs/node-glob) to match paths. | N.A. |
| steps | d | **Required** | A space separated list of file paths to load the step definitions from. We use [glob](https://github.com/isaacs/node-glob) to match paths. | N.A. |
| browsers | b | Optional | A space separated list of browsers to run the tests in. | chrome:headless |
| ports | p | Optional | A space separated list of ports for TestCafé to perform testing on. | 1337,1338 |
| skipJsErrors | e | Optional | Make tests not fail when a JS error happens on a page | false |
| skipUncaughtErrors | u | Optional | Defines whether to continue running a test after an uncaught error or unhandled promise rejection occurs on the server | false |
| disablePageReloads | N.A. | Optional | Disable page reloads between tests | false |
| quarantineMode | q | Optional | Enable quarantine mode | false |
| debugMode | N.A. | Optional | Execute test steps one by one pausing the test after each step | false |
| debugOnFail | N.A. | Optional | Enter debug mode when the test fails | false |
| stopOnFirstFail | sf | Optional | Defines whether to stop a test run if a test fails | false |
| selectorTimeout | N.A. | Optional | Specifies the time (in milliseconds) within which selectors make attempts to obtain a node to be returned | 10000 |
| assertionTimeout | N.A. | Optional | Specifies the time (in milliseconds) within which TestCafe makes attempts to successfully execute an assertion | 3000 |
| pageLoadTimeout | N.A. | Optional | Specifies the time (in milliseconds) TestCafe waits for the window.load event to fire | 3000 |
| speed | N.A. | Optional | Set the speed of test execution (0.01 ... 1) | 1 |
| concurrency | c | Optional | Specifies that tests should run concurrently | 1 |
| app | a | Optional | Executes the specified shell command before running tests. Use it to launch or deploy the application you are going to test. | null |
| appInitDelay | N.A. | Optional | Specifies the time (in milliseconds) allowed for an application launched using the --app option to initialize. | 0 |
| tags | t | Optional | Run only tests having the specified tags | [] |
| proxy | x | Optional | Specifies the proxy server used in your local network to access the Internet | null |

## Programming interface

To get more fine grained control over the testrun, you can use the programming interface.
It is very similar to [TestCafé's programming interface](https://devexpress.github.io/testcafe/documentation/using-testcafe/programming-interface/).
It supports all options of [TestCafé's runner class](https://devexpress.github.io/testcafe/documentation/using-testcafe/programming-interface/runner.html), except it replaces `src` with `steps` and `specs`.

You can use the programming interface almost exactly like TestCafé's. Just replace the import of `testcafe` by `gherkin-testcafe` and replace `src` by `steps` and `specs`:

```diff
- const createTestCafe = require('testcafe');
+ const createTestCafe = require('gherkin-testcafe');

module.exports = async () => {
    const testcafe = await createTestCafe();
    const runner = await testcafe.createRunner();
    const remoteConnection = await testcafe.createBrowserConnection();
    
    return runner
-       .src('test.js')
+       .steps('steps/**/*.js')
+       .specs('specs/**/*.feature')
        .browsers([remoteConnection, 'chrome'])
        .run();
};
```

You can use all [other runner methods](https://devexpress.github.io/testcafe/documentation/using-testcafe/programming-interface/runner.html#methods), that you like as well (e.g. `filter`, `screenshots` and `reporter`).

Just like `src`, you can add multiple paths to search for `specs` and `steps`:

```js
runner
    .step('location-1/*.js')
    .step('location-2/*.js');
    
// or
    
runner.step(['location-1/*.js', 'location-2/*.js'])
```

## Writing step definitions

To write step definitions, import `Given`, `When` and/ or `Then` from `cucumber`<sup>2</sup>:

```js
const { Given, When, Then } = require('cucumber');

Given(/some precondition/, async (t) => {
    // The first argument of Given, When and Then will be a regex that matches the step.
    // The second argument is a function that takes TestCafé's test controller object as a parameter.
});

When(/something (.+) happens/, async (t, param1) => {
    // Captured parameters in the step regex will be passed as arguments to the test implementation.
    // "When Something great happens" will call this function with "great" as `param1`.
});

Then(/an assertion takes place/, async (t) => {
    // Test code is the same as TestCafé's test function accepts.
    await t.expect(true).ok();
});
```

<sup>2</sup> You need to install [Cucumber.js](https://github.com/cucumber/cucumber-js) as a dependency (see [Installation](#installation)).

It is worth noting, that for the test runner, `Given`, `When` and `Then` are the same thing.
You can define

```js
Given(/some step/, async (t) => {
    // Test code
});
```

and use it as

```gherkin
When some step
```

Please refer to the [examples directory](./examples) for more examples.

## Supported gherkin features and limitations

This package supports a wide range of gherkin features.
Most notable features are:

- Features (Gherkin `feature` keyword): Will be transformed into a [TestCafé fixture](https://devexpress.github.io/testcafe/documentation/test-api/test-code-structure.html#fixtures).
- Scenarios (Gherkin `scenario` keyword): Will be transformed into a [TestCafé test](https://devexpress.github.io/testcafe/documentation/test-api/test-code-structure.html#tests).
- Scenario outlines (Gherkin `scenario outline` and `examples` keywords): Will transform every example into on [TestCafé test](https://devexpress.github.io/testcafe/documentation/test-api/test-code-structure.html#tests).
- Tags/ Hooks: See [Tags](#tags) and [Hooks](#hooks).

### Tags

Scenarios can be tagged using [Gherkin's @-notation](https://docs.cucumber.io/cucumber/api/#tags).
The runner can then be configured to filter scenarios to be run based on these tags.
The tags will be evaluated such that scenarios that have any of the including tags (begins with @) but none of the excluding tags (begins with ~@) will be run.

Examples:

```
    runner.tags(['@TAG']) // Will run all scenarios marked with @TAG

    runner.tags(['~@TAG']) // Will run all scenarios that are not marked with @TAG

    runner.tags(['@TAG', '~@OTHER_TAG']) // Will run all scenarios that are marked with @TAG but not with @OTHER_TAG

```

### Hooks

In contrast to [Cucumber.js' hooks](https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/hooks.md), they are implemented differently in this package.
__Because of this inconsistency, this feature will change in the future to match the cucumber documentation better.__
Hooks in this package are always asynchronous.
Instead of taking a callback parameter to end the hook, this package's hooks return a promise.
Once this promise fulfills, the hook is considered done.
The order of hook execution is not guaranteed to follow any rules.
So be careful when using multiple hooks for the same scenario.

#### `Before` and `After`

This package only supports [tagged hooks](https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/hooks.md#tagged-hooks) with a single tag as parameter.
Each hook implementation gets TestCafé's test controller object as a parameter.

```js
const { Before } = require('cucumber');

Before('@tag1', async (t) => {
    // do something
});
```

In the future, untagged hooks will be supported. 

#### `BeforeAll` and `AfterAll`

__The implementation of these hooks is seriously broken and should not be used.__
Currently, `BeforeAll` and `AfterAll` hooks will be run before (or after) each test regardless of scenario tags.

In the future, they will be run before/ after a fixture.
__This will be a breaking change__.
