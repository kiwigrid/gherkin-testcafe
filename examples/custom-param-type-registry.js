const { ParameterTypeRegistry, ParameterType } = require('cucumber-expressions');

class Color {
  constructor(name) {
    this.name = `${name} color`;
  }
}

const registry = new ParameterTypeRegistry();

registry.defineParameterType(
  new ParameterType(
    'color', // name
    /red|blue|yellow/, // regexp
    Color, // type
    name => new Color(name) // transformer function
  )
);

module.exports = registry;
