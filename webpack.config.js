const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    background: './extension/src/background/background.js',
    popup: './extension/src/popup/popup.js',
  },
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist/src/'),
    filename: '[name].js',
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'extension/_locales', to: path.resolve(__dirname, 'dist/_locales') },
      { from: 'extension/assets', to: path.resolve(__dirname, 'dist/assets') },
      { from: 'extension/manifest.json', to: path.resolve(__dirname, 'dist/manifest.json') },
      { from: 'extension/src/popup/popup.html', to: path.resolve(__dirname, 'dist/src/popup.html') },
    ]),
  ],
};
