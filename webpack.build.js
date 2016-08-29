const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
  context: __dirname,
  entry: {
    dragresize: './src/Dragresize.jsx',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
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
      {
        test: /\.less|\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css?minimize&modules&localIdentName=[local]__[hash:base64:10]!postcss!less'),
      },
    ],
  },
  postcss: () => {
    return [autoprefixer];
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ],
};


module.exports = config;
