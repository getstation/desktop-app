const path = require('path');
const webpack = require('webpack');

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: 'ts-loader',
        options: { transpileOnly: true },
      },
    ],
    enforce: 'pre',
  });

  config.resolve.extensions.push('.ts', '.tsx');

  config.resolve.alias['@src'] = path.resolve(__dirname, '../src');

  return config;
};
