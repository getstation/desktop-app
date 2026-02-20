import React from 'react';
import {
  BrowserXThemeProvider,
  COLORS,
  getGradientCSSBackground,
  GradientProvider,
  Theme,
} from '@getstation/theme';
import '../packages/app/src/theme/css/app.global.css';

const preview = {
  parameters: {
    backgrounds: {
      default: 'Sunrise',
      values: [
        { name: 'Transparent', value: 'transparent' },
        { name: 'Dawn', value: getGradientCSSBackground(COLORS.get(Theme.dawn).colors) },
        { name: 'Sunrise', value: getGradientCSSBackground(COLORS.get(Theme.sunrise).colors) },
        { name: 'Morning', value: getGradientCSSBackground(COLORS.get(Theme.morning).colors) },
        { name: 'Midday', value: getGradientCSSBackground(COLORS.get(Theme.midday).colors) },
        { name: 'Afternoon', value: getGradientCSSBackground(COLORS.get(Theme.afternoon).colors) },
        { name: 'Sunset', value: getGradientCSSBackground(COLORS.get(Theme.sunset).colors) },
        { name: 'Night', value: getGradientCSSBackground(COLORS.get(Theme.night).colors) },
      ],
    },
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },
  },
  decorators: [
    (Story) => (
      <BrowserXThemeProvider>
        <GradientProvider themeColors={COLORS.get(Theme.dawn).colors}>
          <Story />
        </GradientProvider>
      </BrowserXThemeProvider>
    ),
  ],
};

export default preview;
