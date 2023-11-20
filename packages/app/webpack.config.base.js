/*
 * This file should only be used if using webpack directly and not through `electron-webpack`
 */

const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  /**
   * @type {webpack.Configuration}
   */
  const conf = {
    context: path.resolve(__dirname), // to automatically find tsconfig.json

    devtool: 'cheap-module-source-map',

    resolve: {
      alias: { '@src': path.resolve(__dirname, 'appstore/src/') },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs', '.svg'],
    },

    node: {
      // The dirname of the output file when run in a Node.js environment.
      __dirname: false,
      // The filename of the output file when run in a Node.js environment.
      __filename: false,
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            // disable type checker - we will use it in fork plugin
            transpileOnly: true
          }
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          ]
        },
        {
          test: /\.graphql$/,
          exclude: /node_modules/,
          loader: 'graphql-import-loader'
        },
        { // fixes https://github.com/graphql/graphql-js/issues/1272
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(woff2?|eot|ttf|otf|png|jpg|gif)(\?.*)?$/,
          loader: 'url-loader',
        }
      ]
    },
  };

  if (argv.mode === 'production') {
    conf.optimization = {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: false,
            mangle: true,
            module: false,
            output: null,
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
      ],
    };

   conf.devtool = process.env.WEBPACK_DEVTOOL;
  }

  return conf;
};
