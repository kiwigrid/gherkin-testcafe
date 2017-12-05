# gherkin-testcafe

> Run testcafe tests with gherkin syntax

### Authors & Sponsors

* Wilhelm Behncke - behncke@sitegeist.de

*The development and the public-releases of this package is generously sponsored
by our employer http://www.sitegeist.de.*

This package is inspired by [helen-dikareva/testcafe-cucumber-demo](https://github.com/helen-dikareva/testcafe-cucumber-demo).
The test example for the google search is taken from there.

### Support

Currently, this tool is still under development and very likely to break.

## Why?

[DevExpress](https://github.com/DevExpress)' [testcafe](http://devexpress.github.io/testcafe/) is an amazing tool for writing acceptance tests. Unfortunately it currently lacks support for
BDD-style tests using the famous [gherkin](https://github.com/cucumber/cucumber/wiki/Gherkin) Syntax (Although there seem to be [plans for future support](https://github.com/DevExpress/testcafe/issues/1373#issuecomment-291526857)).

This tool provides a setup in which gherkin `*.feature` specs can be used to run testcafe tests.

## What does this do?

The tool itself has just a small footprint to glue testcafe and gherkin together.

It uses testcafe as the testrunner and constructs the `fixture` and `test` calls from gherkin sources during runtime.

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

*Not yet implemented*

## Writing step definitions

With the `--steps` parameter you can specify where to find your step definitions. These are contained in a file of the following form:

```js
module.exports = function defineSteps({given, when, then}) {
	given(`I have a step definition with parameter {string}`, (t, myParameter) => {
		// Test implementation here
	});
}
```

`given`, `when` and `then` refer to their gherkin counterparts. Each of these functions takes two parameters.

The first one expects a parameterized step expression. You'll find more on that in the [cucumber-expressions Documentation](https://github.com/cucumber/cucumber/tree/master/cucumber-expressions#cucumber-expressions).

The second one expects a function (that is allowed to be be `async`), which executes the actual test. That function
will get the testcafe test controller as its first parameter (`t` in the example). With that you can use the entirety
of test cafes [Test API](http://devexpress.github.io/testcafe/documentation/test-api/).

All subsequent parameters for the test function are resolved from the given step expression.

## License

see [LICENSE.md](./LICENSE.md)
