const webpack = require('webpack');

module.exports = (config) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('@storybook/addon-storysource/loader'),
      },
      {
        loader: 'ts-loader',
        options: { transpileOnly: true },
      },
    ],
    enforce: 'pre',
  });

  config.module.rules.push({
    test: /\.svg$/,
    exclude: /node_modules/,
    use: [{ loader: 'svg-inline-loader' }]
  });

  config.module.rules.push({
    test: /\.graphql$/,
    exclude: /node_modules/,
    use: [{ loader: 'graphql-import-loader' }]
  });

  config.module.rules.push({
    test: /\.css$/,
    exclude: /node_modules/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
  });

  config.resolve.extensions.push('.ts', '.tsx');

  config.resolve.alias['handlebars'] = 'handlebars/dist/handlebars.min.js';

  config.externals = ['electron'];

  return config;
};
