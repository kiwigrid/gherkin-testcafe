const glob = require('glob');
const fs = require('fs');
const {Parser, Compiler} = require('gherkin');

const resolveStepDefinition = require('./resolveStepDefinition');
const {specs} = require('./args').argv;
const paths = [].concat(...specs.map(pattern => glob.sync(pattern)));

//
// Takes a step from a gherkin AST, looks up the corresponding step definition
// and runs the implementation of that definition given the actual values from
// the step.
//
// It also warns, if a step definition could not be found.
//
function resolveAndRunStepDefinition(testController, step) {
	const {expression, implementation} = resolveStepDefinition(step);

	if (expression && implementation) {
		return implementation(
			testController,
			...expression.match(step.text).map(match => match.getValue())
		);
	} else {
		console.warn(`Step implementation missing for: ${step.text}`);
	}
}

//
// Turns a scenario from a gherkin AST into a testcafe test
//
function createTestFromScenario(scenario) {
	test(`Scenario: ${scenario.name}`, t => Promise.all(scenario.steps.map(
		step => resolveAndRunStepDefinition(t, step)
	)));
}

//
// Turns a feature from a gherkin AST into a testcafe fixture
//
function createFixtureFromSpecFile(specFilePath) {
	const gherkinAst = new Parser().parse(fs.readFileSync(specFilePath).toString());

	fixture(`Feature: ${gherkinAst.feature.name}`);

	gherkinAst.feature.children.forEach(createTestFromScenario);
}

//
// Run the tests for all mathing paths
//
paths.forEach(createFixtureFromSpecFile);
