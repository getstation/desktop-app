const path = require('path');

module.exports = ({ config }) => {
  config.node = Object.assign({}, config.node, { __dirname: true });

  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    include: path.resolve(__dirname, '../'),
    exclude: /node_modules/,
    use: [
      require.resolve('@storybook/addon-storysource/loader'),
      { loader: require.resolve('ts-loader'), options: { transpileOnly: true } },
    ],
    enforce: 'pre',
  });
  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};
