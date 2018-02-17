const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './extension/src/background.js',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist/src/'),
    filename: 'background.js',
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'extension/_locales', to: path.resolve(__dirname, 'dist/_locales') },
      { from: 'extension/assets', to: path.resolve(__dirname, 'dist/assets') },
      { from: 'extension/manifest.json', to: path.resolve(__dirname, 'dist/manifest.json') },
    ]),
  ],
};
