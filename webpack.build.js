const path = require('path');
const autoprefixer = require('autoprefixer');

const config = {
  context: __dirname,
  entry: {
    dragresize: './src/Dragresize.jsx',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    libraryTarget: 'umd',
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
        loader: 'style!css?modules&localIdentName=[local]__[hash:base64:10]!postcss!less',
      },
    ],
  },
  postcss: () => {
    return [autoprefixer];
  },
  externals: {
    react: {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
    },
  },
  devtool: 'source-map',
};


module.exports = config;
