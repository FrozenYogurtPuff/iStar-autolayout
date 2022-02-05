const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'demo.ts'),
  mode: 'development',
  watch: true,
  devtool: 'source-map',
  output: {
    filename: 'main.js',
    path: __dirname,
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
