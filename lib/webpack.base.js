const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  entry: ['./index.js'],
  output: {
    path: path.resolve(__dirname, '../docs'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      { test: /\.vue$/, loader: 'vue-loader' },
      {
        test: /\.styl$/,
        use: [ 'style-loader', 'css-loader', 'stylus-loader' ]
      },
      {
        test: /\.(woff(2)?|otf|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: { name: '[name].[ext]', outputPath: 'fonts/' }
        }]
      }
    ]
  },
  plugins: [
    new HtmlPlugin({ template: './index.html' }),
    new VueLoaderPlugin()
  ]
}
