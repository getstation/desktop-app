/**
 * webui compoments can't be build through electron-webpack yet because it doesn't support `target: 'web'`.
 * So we have to build it manually.
 */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const WriteFilePlugin = require('write-file-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.config.base');

module.exports = (env, argv) => merge.smart(baseConfig(env, argv), {
  target: 'web',

  node: {
    global: true,
    __dirname: 'mock',
  },

  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['multiInstanceConfiguration'],
      filename: 'multi-instance-configuration.html',
      template: './app/app-sub.html',
    }),
    new webpack.NamedModulesPlugin(),
    new WriteFilePlugin(),
  ],

  entry: {
    multiInstanceConfiguration: './app/applications/multi-instance-configuration/webui/index.tsx',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.graphql', '.svg']
  },

  externals: [
    {
      fs: '{ join: () => {} }',
    },
  ],


  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist', 'renderer'),
    chunkFilename: '[name].bundle.js',
  },
});
