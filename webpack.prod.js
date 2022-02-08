const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const common = require('./webpack.config.js');

module.exports = merge(common({ mode: 'production' }), {
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin(),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter: '-',
    },
  },
});
