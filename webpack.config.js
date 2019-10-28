const path = require('path');
const webpack = require('webpack');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  context: __dirname,
  entry: {
    example: './example/index.js',
  },
  output: {
    path: path.resolve(__dirname, '/dist'),
    filename: '[name]_[hash].js',
    publicPath: '/',
  },
  resolve: {
    root: [
      path.join(__dirname, '/src'),
    ],
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    noParse: [],
    loaders: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=25000' },
      { test: /\.html$/, loader: 'html' },
      {
        test: /\.less|\.css$/,
        loader: 'style!css?modules&localIdentName=[local]__[hash:base64:10]!postcss!less',
        // loader: ExtractTextPlugin.extract('style-loader', 'css?minimize&modules&localIdentName=[local]__[hash:base64:10]!postcss!less'),
      },
    ],
  },
  postcss: () => {
    return [autoprefixer];
  },
  plugins: [
    // new ExtractTextPlugin('[name].css'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./dist/manifest.json'),
    }),
    new HtmlWebpackPlugin({
      template: './example/index.html',
    }),
  ],
  devServer: {
    devtool: true,
    colors: true,
    port: '8888',
    progress: true,
    host: '0.0.0.0',
  },
};


module.exports = config;
