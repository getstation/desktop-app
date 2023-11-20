/* eslint-disable no-param-reassign */
/**
 * Build config for electron renderer process
 */
const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { mutateWebpackConfig } = require('./webpack.config.common');

// Packages that we want to be bundled
const externalsWhitelist = [
  'slack', // forces "browser" target
  /*'redux-ui',
  'redux-ui/transpiled/action-reducer',
  '@getstation/theme',
  '@storybook/react',
  '@storybook/ui',
  'react-apollo',
  "react-apollo-hooks",
  "react-click-outside",
  "react-dnd",
  "react-dnd-html5-backend",
  "react-hover-observer",
  "react-image",
  "react-immutable-proptypes",
  "react-jss",
  "react-key-handler",
  "react-popper",
  "react-redux",
  "react-resize-detector",
  "react-svg-inline",
  "react-tether",
  "react-transition-group",
  'scrollmonitor-react',
  'prop-types',
  'classnames',
  'scroll-into-view-if-needed',
  'use-events',
  'use-key-hook'*/
];

/**
 * @param config {webpack.Configuration}
 */
module.exports = (config) => {
  // console.log(require('util').inspect(config, { depth: 8 }));
  mutateWebpackConfig(config);

  config.target = 'electron-renderer';

  config.plugins = config.plugins.map((plugin) => {
    // default HtmlWebpackPlugin should be the worker
    if (plugin.constructor.name === 'HtmlWebpackPlugin') {
      plugin.options.chunks = ['worker'];
    }
    return plugin;
  });

  config.plugins = config.plugins.concat([
    new MiniCssExtractPlugin({
      filename: '[name].styles.css',
      chunkFilename: '[id].styles.css',
    }),
    // generates main window html file
    new HtmlWebpackPlugin({
      chunks: ['mainRenderer'],
      filename: 'main.html',
      template: './app/app.html',
      inject: true,
    }),
    // generates sub windows html file
    new HtmlWebpackPlugin({
      chunks: ['subRenderer'],
      filename: 'sub.html',
      template: './app/app-sub.html',
      inject: true,
    }),
    // generates about window html file
    new HtmlWebpackPlugin({
      chunks: ['aboutRenderer'],
      filename: 'about.html',
      template: './app/about-window/about.html',
      inject: true,
    }),
  ]);

  config.entry = {
    // main window
    mainRenderer: './app/index.js',
    // sub windows
    subRenderer: './app/index-sub.js',
    // about window
    aboutRenderer: './app/about-window/about.js',
    // worker
    worker: './app/app-worker.ts',
  };

  // migration files
  Object.assign(config.entry, glob.sync('./app/persistence/umzug-runs/*.js')
    .reduce((obj, filepath) => {
      const filename = path.basename(filepath, path.extname(filepath));
      return {
        ...obj,
        [filename]: filepath
      };
    }, {}));

  // '/' is necessary to resolve Icons.svg from theme
  if (config.devServer) {
    // Mainly for `static` folder, probably a cleaner way to do this that is compatible with dev and prod
    config.devServer.contentBase.push(path.resolve(__dirname, 'app'));
    config.devServer.contentBase.push('/');
    config.devServer.headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' };
  }

  if (config.mode === 'development') {
    // with this we can use preload file in dev mode
    config.plugins.push(new webpack.DefinePlugin({
      __webpack_public_path__: JSON.stringify(config.output.path),
      __webpack_main_path__: JSON.stringify(path.resolve(config.output.path, '../main')),
    }));
  }

  config.output.filename = (chunkData) => {
    // umzug-runs files should be in 'umzug-runs' directory to be found by umzug
    if (path.basename(chunkData.chunk.entryModule.context) === 'umzug-runs') {
      return 'umzug-runs/[name].js';
    }
    // default
    return '[name].js';
  };

  config.externals.push('react');
  config.externals.push('react-dom');
  config.externals = config.externals.filter(e => !externalsWhitelist.includes(e));

  return config;
};
