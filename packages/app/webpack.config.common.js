require('./webpack.monkeypatch-crypto');
const path = require('path');
const webpack = require('webpack');

/* eslint-disable no-param-reassign */

/**
 * Disable verbose logs
 * @param config {webpack.Configuration}
 */
const mutateStats = config => {
  config.stats = 'errors-only';
};

/**
 * set ts-loader as transpileOnly for now. Also excludes node_modules from compilation
 * @param config {webpack.Configuration}
 */
const mutateFixTsLoader = config => {
  const tsLoader = config.module.rules.find(
    r => r && r.use && r.use[0] && r.use[0].loader === 'ts-loader'
  );

  if (tsLoader) {
    tsLoader.use[0].options.transpileOnly = true;
    tsLoader.exclude = /node_modules/;
  }
};

/**
 * minimizer should keep classnames and fnames
 * @param config {webpack.Configuration}
 */
const mutateFixTerser = config => {
  if (config.mode === 'production') {
    Object.assign(config.optimization.minimizer[0].options.terserOptions, {
      keep_classnames: true,
      keep_fnames: true
    });
  }
};

/**
 * add sources to sourcemap
 * @param config {webpack.Configuration}
 */
const mutateDevtool = config => {
  if (config.mode === 'production') {
    config.devtool = process.env.WEBPACK_DEVTOOL;
  }
};

/**
 * loader for graphql schema and .env.* files
 * @param config {webpack.Configuration}
 */
const mutateAddRules = config => {
  config.module.rules.push({
    test: /\.graphql$/,
    exclude: /node_modules/,
    loader: 'graphql-import-loader'
  });
};

/**
 * minimizer should keep classnames and fnames
 * @param config {webpack.Configuration}
 */
const mutateAddExternals = config => {
  // Used by window-open overload
  config.externals.push('react-addons-perf');
};

/**
 * alias some missing imports
 * @param config {webpack.Configuration}
 */
const mutateAlias = config => {
  // Electron does not bundle `ipcRendererInternal` anymore since 7.x
  config.resolve.alias[
    '@electron/internal/renderer/ipc-renderer-internal'
  ] = path.resolve(__dirname, 'app/lib/ipc-renderer-internal.ts');
};

/**
 * electron-webpack injects every `@babel/plugin-*` devDependency into
 * babel-loader without options. Recent Babel versions refuse the decorators
 * plugin without an explicit `version`/`legacy` option, so pass the same
 * options as in .babelrc.
 * @param config {webpack.Configuration}
 */
const mutateFixBabelDecorators = config => {
  const decorators = require('@babel/plugin-proposal-decorators').default;

  config.module.rules.forEach(rule => {
    const uses = [].concat(rule.use || rule.loader || []);
    uses.forEach(use => {
      if (!use || use.loader !== 'babel-loader' || !use.options) return;
      use.options.plugins = (use.options.plugins || []).map(plugin => {
        const fn = Array.isArray(plugin) ? plugin[0] : plugin;
        return fn === decorators ? [decorators, { legacy: true }] : plugin;
      });
    });
  });
};

/**
 * @param config {webpack.Configuration}
 */
const mutateWebpackConfig = config => {
  mutateFixBabelDecorators(config);
  mutateStats(config);
  mutateFixTsLoader(config);
  mutateFixTerser(config);
  mutateAddRules(config);
  mutateAddExternals(config);
  mutateDevtool(config);
  mutateAlias(config);

  if (config.mode === 'production') {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.GOOGLE_CLIENT_ID': JSON.stringify(
          process.env.GOOGLE_CLIENT_ID
        ),
        'process.env.GOOGLE_CLIENT_SECRET': JSON.stringify(
          process.env.GOOGLE_CLIENT_SECRET
        )
      })
    );
  }
};

module.exports = {
  mutateWebpackConfig
};
