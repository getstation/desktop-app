const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebPackPlugin = require('copy-webpack-plugin');

const PATHS = {
  root: path.resolve(__dirname, '..'),
  nodeModules: path.resolve(__dirname, '../node_modules'),
  src: path.resolve(__dirname, '../src'),
  dist: path.resolve(__dirname, '../../dist/renderer/appstore'),
  static: path.resolve(__dirname, '../src/static'),
};

const DEV_SERVER = {
  // hot: true,
  // hotOnly: true,
  historyApiFallback: true,
  overlay: true,
  compress: true,
  // stats: 'verbose',
  // proxy: {
  //   '/api': 'http://localhost:3000'
  // },
};

module.exports = (env = {}) => {
  const isBuild = !!env.build;
  const isDev = !env.build;
  const isSourceMap = !!env.sourceMap || isDev;
  const envConfig = require('./' + (isDev ? 'development' : 'production') + '.config.js');

  return {
    cache: true,
    devtool: isDev ? 'eval-source-map' : false,
    devServer: DEV_SERVER,

    context: PATHS.root,

    entry: {
      app: [
        './src/index.tsx',
      ],
    },

    target: 'electron-renderer',

    output: {
      path: PATHS.dist,
      filename: isDev ? '[name].js' : '[name].[hash].js',
      sourceMapFilename: isDev ? '[name].js.map' : '[name].[hash].js.map',
      publicPath: '',
    },

    resolve: {
      alias: { '@src': PATHS.src },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.graphql', '.svg'],
    },

    // externals: {
    // },

    module: {
      rules: [
        // typescript
        {
          test: /\.tsx?$/,
          include: PATHS.src,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              compilerOptions: {
                'sourceMap': isSourceMap,
                'target': isDev ? 'es2015' : 'es5',
                'isolatedModules': true,
                'noEmitOnError': false,
              },
            },
          },
        },
        // graphql file loader
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          use: { loader: 'graphql-tag/loader' },
        },
        { // fixes https://github.com/graphql/graphql-js/issues/1272
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        },
        // js
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(svg|png|jpg)/,
          use: {
            loader: 'file-loader',
            options: {
              outputPath: 'static/',
            }
          },
        },
      ],
    },
    optimization: {
      ...(isBuild ? {
            minimizer: [
              new TerserPlugin({
                terserOptions: {
                  comments: false,
                  ecma: undefined,
                  warnings: false,
                  parse: {},
                  compress: false,
                  mangle: true,
                  module: false,
                  output: { comments: false },
                  toplevel: false,
                  nameCache: null,
                  ie8: false,
                  keep_classnames: true,
                  keep_fnames: true,
                  safari10: false,
                },
                sourceMap: true,
                parallel: true,
              }),
            ]
          } : {}),
      runtimeChunk: 'single',
      splitChunks: {
        // https://webpack.js.org/plugins/split-chunks-plugin/
        cacheGroups: {
          vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              enforce: true,
              chunks: 'all'
          }
        }
      },
    },
    plugins: [
      new webpack.DefinePlugin(envConfig),
      new CopyWebPackPlugin([
        { context: './src/static/', from: './**/*', to: 'static' }
      ]),
      new HtmlWebpackPlugin({
        template: './index.html',
        favicon: './src/static/favicon.png',
      }),
      ...(isDev ? [
        new webpack.HotModuleReplacementPlugin({
          // multiStep: true, // better performance with many files
        }),
      ] : []),
    ]
  };
};
