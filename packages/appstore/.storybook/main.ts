import path from 'path';
import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx', '../src/**/stories.tsx'],
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
      use: [
        {
          loader: 'ts-loader',
          options: { transpileOnly: true },
        },
      ],
      enforce: 'pre',
    });

    config.resolve = config.resolve || {};
    config.resolve.extensions = config.resolve.extensions || [];
    config.resolve.extensions.push('.ts', '.tsx');
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['@src'] = path.resolve(__dirname, '../src');

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
