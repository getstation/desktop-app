const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebPackPlugin = require('copy-webpack-plugin');

const PATHS = {
  root: path.resolve(__dirname, '..'),
  nodeModules: path.resolve(__dirname, '../node_modules'),
  src: path.resolve(__dirname, '../src'),
  dist: path.resolve(__dirname, '../../../dist/renderer/appstore'),
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
    devtool: isDev ? 'eval-source-map' : 'source-map',
    devServer: DEV_SERVER,

    context: PATHS.root,

    entry: {
      app: [
        'react-hot-loader/patch',
        './src/index.tsx',
      ],
    },
    output: {
      path: PATHS.dist,
      filename: isDev ? '[name].js' : '[name].[hash].js',
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
          use: (env.awesome ?
            [
              { loader: 'react-hot-loader/webpack' },
              {
                loader: 'awesome-typescript-loader',
                options: {
                  transpileOnly: true,
                  useTranspileModule: false,
                  sourceMap: isSourceMap,
                },
              },
            ] : [
              { loader: 'react-hot-loader/webpack' },
              {
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
            ]
          ),
        },
        // graphql file loader
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          use: { loader: 'graphql-tag/loader' },
        },
        // js
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        // json
        {
          test: /\.json$/,
          include: [PATHS.src],
          use: { loader: 'json-loader' },
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

    plugins: [
      new webpack.DefinePlugin(envConfig),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: (module) => module.context && module.context.indexOf('node_modules') !== -1,
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
      }),
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
        new webpack.NamedModulesPlugin(),
      ] : []),
      ...(isBuild ? [
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false
        }),
        new UglifyJsPlugin({
          uglifyOptions: {
            output: { comments: false },
            mangle: false,
            compress: {
              sequences: true,
              dead_code: true,
              conditionals: true,
              booleans: true,
              unused: true,
              if_return: true,
              join_vars: true,
              drop_console: false
            },
          }
        }),
      ] : []),
    ]
  };
};
