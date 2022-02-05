const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'src/index.ts'),
  mode: 'production',
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
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
