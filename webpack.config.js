//@ts-check
'use strict';

const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load .env file
const env = dotenv.config().parsed || {};

// Convert environment variables into DefinePlugin format
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

/** @typedef {import('webpack').Configuration} WebpackConfig */
/** @type WebpackConfig */
const extensionConfig = {
  target: 'node', // VS Code extensions run in a Node.js-context
  mode: 'none',   // Keep source readable for development

  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode' // Required for VS Code extensions
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(envKeys)
  ],
  devtool: 'nosources-source-map',
  infrastructureLogging: {
    level: 'log'
  }
};

module.exports = [extensionConfig];
