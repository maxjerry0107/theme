const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MediaQueryPlugin = require('media-query-plugin');

module.exports = (env) => ({
  mode: env.mode,
  entry: path.resolve(__dirname, 'src/scripts/bvaccel.js'),
  stats: {
    entrypoints: false,
  },
  output: {
    path: path.resolve(__dirname, 'dist/assets'),
    filename: '[name].js',
    chunkFilename: '[name].js?[chunkhash:5]',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter: '-',
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.scss$/,
        use: [
          env.mode === 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          MediaQueryPlugin.loader,
          {
            loader: 'sass-loader',
            options: {
              data: `
                @import "styles/boilerplate.scss";
              `,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      path: path.resolve(__dirname, 'dist/assets'),
      filename: 'bvaccel-app.css',
    }),
    new MediaQueryPlugin({
      include: [path.resolve(__dirname, 'dist/assets/bvaccel-app.css')],
      queries: {
        '(min-width: 992px)': 'desktop',
        '(min-width: 650px)': 'tablet',
        '(min-width: 1px)': 'mobile',
      },
    }),
  ],
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      scripts: path.resolve(__dirname, 'src/scripts/'),
      styles: path.resolve(__dirname, 'src/styles/'),
    },
  },
});
