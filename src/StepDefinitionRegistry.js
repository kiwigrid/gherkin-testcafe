const {
  CucumberExpression,
  ParameterTypeRegistry
} = require("cucumber-expressions");

//
// A global registry to load load and resolve all step definitions
//
module.exports = class StepDefinitionRegistry {
  constructor() {
    this.definitions = {};
    this.runtime = {};
    this.latestType = "";

    const parameterTypeRegistry = new ParameterTypeRegistry();

    ["given", "when", "then"].forEach(keyword => {
      this.definitions[keyword] = [];
      this.runtime[keyword] = (expression, implementation) =>
        this.definitions[keyword].push({
          implementation,
          expression: new CucumberExpression(expression, parameterTypeRegistry)
        });
    });

    this.load = definitionFactoryFunction =>
      definitionFactoryFunction(this.runtime);
  }

  resolve(type, text) {
    if (type === "and") {
      type = this.latestType;
    }

    if (this.definitions[type]) {
      this.latestType = type;
      return this.definitions[type].filter(({ expression }) =>
        expression.match(text)
      )[0];
    }
  }
};
