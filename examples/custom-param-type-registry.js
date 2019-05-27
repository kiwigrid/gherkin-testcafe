const cucumberExpressions = require('cucumber-expressions');

class Color {
  constructor(name) {
    this.name = `${name} color`;
  }
}

const registry = new cucumberExpressions.ParameterTypeRegistry();

registry.defineParameterType(
  new cucumberExpressions.ParameterType(
    'color', // name
    /red|blue|yellow/, // regexp
    Color, // type
    s => new Color(s) // transformer function
  )
);

module.exports = registry;
