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

## Upgrading from version 1.x

With TestCafé version 1.0, this package has introduced some breaking changes to it's API.
These changes help this package be more future-proof in terms of upcoming features.

When upgrading from version 1 to version 2, keep in mind, that the following things have changed:

* CLI interface is now passed through from TestCafé itself. So some options have changed:
  * `--specs`, `--steps`, `-s` and `-d` option no longer exist. Please define all the files as regular test files.
    Also note, that all feature files have to have `.feature` file ending.
  * `-b` option is now a shorthand for `--list-browsers` (as it is in the regular testcafe CLI). 
    Define browsers like you would in testcafe.
    See also [CLI usage](#cli-usage).
* Step parameters are now passed to the step implementation as an array.
  Code needs to be refactored in the following way:
  ```diff
  - Given(/some (.+) text (.+) with (.+) capturing (.+) groups/, async (t, param1, param2, param 3, param 4) => {});
  + Given(/some (.+) text (.+) with (.+) capturing (.+) groups/, async (t, [param1, param2, param 3, param 4]) => {});
  ```
* BeforeAll and AfterAll hooks now run before/ after a feature, not a scenario. See also [BeforeAll and AfterAll](#beforeall-and-afterall).
* The same prohibition for multiple method calls as for testcafe@1.0.0 applies. See also [testcafe@1.0.0 release notes](https://github.com/DevExpress/testcafe/releases/tag/v1.0.0).
* Legacy Docker support dropped

## CLI usage

Use the `gherkin-testcafe` just like you use TestCafé's CLI. Just replace `testcafe` by `gherkin-testcafe` and load all JS and feature files:

    gherkin-testcafe firefox,IE tests/**/*.js tests/**/*.feature
    
Use `--help` command to see all options:

    gherkin-testcafe --help
    
All [TestCafé CLI options](https://devexpress.github.io/testcafe/documentation/using-testcafe/command-line-interface.html) are supported.
 
## Programming interface

To get more fine grained control over the testrun, you can use the programming interface.
It is very similar to [TestCafé's programming interface](https://devexpress.github.io/testcafe/documentation/using-testcafe/programming-interface/).
It supports all options of [TestCafé's runner class](https://devexpress.github.io/testcafe/documentation/using-testcafe/programming-interface/runner.html), except it replaces `src` with `steps` and `specs`.

You can use the programming interface almost exactly like TestCafé's. Just replace the import of `testcafe` by `gherkin-testcafe` and load all step and spec files:

```diff
- const createTestCafe = require('testcafe');
+ const createTestCafe = require('gherkin-testcafe');

module.exports = async () => {
    const testcafe = await createTestCafe();
    const runner = await testcafe.createRunner();
    const remoteConnection = await testcafe.createBrowserConnection();

    return runner
-       .src('test.js')
+       .steps(['steps/**/*.js', 'specs/**/*.feature'])
        .browsers([remoteConnection, 'chrome'])
        .run();
};
```

You can use all [other runner methods](https://devexpress.github.io/testcafe/documentation/using-testcafe/programming-interface/runner.html#methods), that you like as well (e.g. `filter`, `screenshots` and `reporter`).

## Writing step definitions

To write step definitions, import `Given`, `When` and/ or `Then` from `cucumber`<sup>2</sup>:

```js
const { Given, When, Then } = require('cucumber');

Given(/some precondition/, async (t) => {
    // The first argument of Given, When and Then will be a regex that matches the step.
    // The second argument is a function that takes TestCafé's test controller object as a parameter.
});

When(/something (.+) happens/, async (t, params) => {
    // Captured parameters in the step regex will be passed as the second argument to the test implementation.
    // "When Something great happens" will call this function with `["great"]` as `params`.
});

When(/something (.+) and (.+) happens/, async (t, [param1, param2]) => {
    // You can use regular array destructuring to access params directly.
    // "When Something great and awesome happens" will result in `"great"` as `param1` and `"awesome"` as `param2`.
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
- Tables are not (yet) supported. See #14.

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

__Note:__ Do not set `--tags` CLI parameter when running tests through the programming interface as it is internally used to pass the selected tags to the gherkin compiler.

### Hooks

In contrast to [Cucumber.js' hooks](https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/hooks.md), they are implemented differently in this package.
Hooks in this package are always asynchronous.
Instead of taking a callback parameter to end the hook, this package's hooks return a promise.
Once this promise fulfills, the hook is considered done.
The order of hook execution is not guaranteed to follow any rules.
So be careful when using multiple hooks for the same scenario.

#### `Before` and `After`

Before/ After hooks run before or after each test (i.e. scenario).
Each hook implementation gets TestCafé's test controller object as a parameter.

```js
const { Before } = require('cucumber');

Before('@tag1', async (t) => {
    // do something
    // e.g. write to t.ctx or read from t.fixtureCtx
});
```

Untagged hooks are run before/ after each test.

#### `BeforeAll` and `AfterAll`

BeforeAll/ AfterAll hooks run before and after each fixture (i.e. feature).
Each hook implementation gets TestCafé's fixture context. 
See [Sharing Variables Between Fixture Hooks and Test Code](https://devexpress.github.io/testcafe/documentation/test-api/test-code-structure.html#sharing-variables-between-fixture-hooks-and-test-code) documentation for more details.

```js
const { BeforeAll } = require('cucumber');

BeforeAll(async (ctx) => {
    // do something with the context
})
```
