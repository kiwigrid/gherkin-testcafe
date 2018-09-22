const { resolve } = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    main: './src/createTestcafeGherkin.js',
    cli: './main.js'
  },
  output: {
    path: resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env']
        }
      }
    ]
  },
  target: 'node',
  externals: [nodeExternals()]
};
