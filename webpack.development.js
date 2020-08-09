const { HotModuleReplacementPlugin } = require('webpack')
const base = require('./webpack.base.js')
const { merge } = require('webpack-merge')
const path = require('path')

module.exports = merge(base, {
  mode: 'development',
  entry: ['webpack-hot-middleware/client'],
  plugins: [
    new HotModuleReplacementPlugin()
  ],
  devServer: {
    host: '0.0.0.0',
    contentBase: './docs'
  }
})
