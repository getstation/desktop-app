import React from 'react';
import { addDecorator, addParameters, configure } from '@storybook/react';
import { BrowserXThemeProvider } from '../lib/BrowserXThemeProvider';
import { COLORS, Theme } from '../lib/constants';
import { GradientProvider } from '../lib/gradient';
import {getGradientCSSBackground} from "../lib/jss";

addParameters({
  options: {
    name: 'Station Theme v' + require('../package.json').version,
    hierarchySeparator: /\//,
    hierarchyRootSeparator: /\|/,
  },
  backgrounds: [
        { name: 'Transparent', value: 'transparent'},
        { name: 'Dawn', value: getGradientCSSBackground(COLORS.get(Theme.dawn).colors)},
        { name: 'Sunrise', value: getGradientCSSBackground(COLORS.get(Theme.sunrise).colors), default: true},
        { name: 'Morning', value: getGradientCSSBackground(COLORS.get(Theme.morning).colors)},
        { name: 'Midday', value: getGradientCSSBackground(COLORS.get(Theme.midday).colors)},
        { name: 'Afternoon', value: getGradientCSSBackground(COLORS.get(Theme.afternoon).colors)},
        { name: 'Sunset', value: getGradientCSSBackground(COLORS.get(Theme.sunset).colors)},
        { name: 'Night', value: getGradientCSSBackground(COLORS.get(Theme.night).colors)},
        { name: 'Gmail', value: 'top / 100% no-repeat url("/lib/stories/assets/interface-gmail.png")'},
        { name: 'Calendar', value: 'top / 100% no-repeat url("/lib/stories/assets/interface-calendar.png")'},
        { name: 'GDrive', value: 'top / 100% no-repeat url("/lib/stories/assets/interface-gdrive.png")'},
        { name: 'Slack', value: 'top / 100% no-repeat url("/lib/stories/assets/interface-slack.png")'},
        { name: 'Notion', value: 'top / 100% no-repeat url("/lib/stories/assets/interface-notion.png")'},
    ],
});

const req = require.context('../', true, /stories.tsx$/);
function loadStories() {
  require('../lib/stories/home');
  req.keys().forEach(filename => req(filename));
}

addDecorator((story) => (
  <BrowserXThemeProvider>
    <GradientProvider themeColors={COLORS.get(Theme.dawn).colors}>
      {story()}
    </GradientProvider>
  </BrowserXThemeProvider>
));

configure(loadStories, module);
