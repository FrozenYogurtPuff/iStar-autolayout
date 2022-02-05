const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'src/index.ts'),
  mode: 'production',
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'global',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: require.resolve(path.join(__dirname, 'src/index.ts')),
        loader: 'expose-loader',
        options: {
          exposes: ['istarLayout'],
        },
      },
      {
        test: require.resolve('lodash'),
        loader: 'expose-loader',
        options: {
          exposes: ['_'],
        },
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
};
