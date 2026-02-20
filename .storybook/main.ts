import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../packages/app/src/**/stories.tsx', '../packages/app/src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-actions',
    '@storybook/addon-essentials',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: false,
  },
  webpackFinal: async (config, { configType }) => {
    config.module = config.module || { rules: [] };
    config.module.rules = config.module.rules || [];

    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: [
        path.resolve(__dirname, '../packages/app/src'),
        path.resolve(__dirname),
      ],
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: path.resolve(__dirname, '../packages/app/tsconfig.json'),
            context: path.resolve(__dirname, '../packages/app'),
          },
        },
      ],
      enforce: 'pre',
    });

    config.module.rules.push({
      test: /\.svg$/,
      exclude: /node_modules/,
      use: [{ loader: 'svg-inline-loader' }],
    });

    config.module.rules.push({
      test: /\.graphql$/,
      exclude: /node_modules/,
      use: [{ loader: 'graphql-import-loader' }],
    });

    config.resolve = config.resolve || {};
    config.resolve.extensions = config.resolve.extensions || [];
    config.resolve.extensions.push('.ts', '.tsx');
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias.handlebars = 'handlebars/dist/handlebars.min.js';

    const existingExternals = config.externals || [];
    config.externals = Array.isArray(existingExternals)
      ? [...existingExternals, 'electron']
      : [existingExternals, 'electron'];

    if (configType === 'PRODUCTION') {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
        },
        runtimeChunk: 'single',
      };
    }

    return config;
  },
};

export default config;
