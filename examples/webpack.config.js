const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: path.join(__dirname, 'demo.js'),
  mode: 'production',
  // watch: true,
  // devtool: 'source-map',
  output: {
    filename: 'main.js',
    path: __dirname
  },
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false
    })]
  }
}
