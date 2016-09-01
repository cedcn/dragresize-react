const webpack = require('webpack');

const vendors = [
  'react',
  'react-dom',
];

module.exports = {
  output: {
    path: 'dist',
    filename: '[name].js',
    library: '[name]',
  },
  entry: {
    lib: vendors,
  },
  plugins: [
    new webpack.DllPlugin({
      path: './dist/manifest.json',
      name: '[name]',
      context: __dirname,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: true,
      },
    }),
  ],
};
