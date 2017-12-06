const glob = require('glob');
const path = require('path');
const {CucumberExpression, ParameterTypeRegistry} = require('cucumber-expressions');

const {steps} = require('./args').argv;
const stepDefinitionsPaths = [].concat(...steps.map(pattern => glob.sync(pattern)));
const parameterTypeRegistry = new ParameterTypeRegistry();

//
// A global registry to load load and resolve all step definitions
//
class StepDefinitionRegistry {
	constructor() {
		this.definitions = {};
		this.runtime = {};
		this.latestType = '';

		['given', 'when', 'then'].forEach(keyword => {
			this.definitions[keyword] = [];
			this.runtime[keyword] = (expression, implementation) => this.definitions[keyword].push({
				implementation,
				expression: new CucumberExpression(expression, parameterTypeRegistry)
			});
		})

		this.load = definitionFactoryFunction => definitionFactoryFunction(this.runtime);
	}

	resolve(type, text) {
		if (type === 'and') {
			type = this.latestType;
		}

		if (this.definitions[type]) {
			this.latestType = type;
			return this.definitions[type].filter(({expression}) => expression.match(text))[0]
		}
	}
};

//
// Initialize a sole instance of the registry
//
const stepDefinitionRegistry = new StepDefinitionRegistry();

//
// Load all step definitions
//
stepDefinitionsPaths.forEach(stepDefinitionsPath => {
	const definitionFactoryFunction = require(path.resolve(stepDefinitionsPath));

	stepDefinitionRegistry.load(definitionFactoryFunction);
});

//
// Given a step from a gherkin AST, this will find the corresponding step definition or
// return an empty object, if there is none
//
module.exports = function resolveStepDefinition(step, predecessor) {
	const stepDefinition = stepDefinitionRegistry.resolve(step.keyword.toLowerCase().trim(), step.text);

	return stepDefinition || {};
};
