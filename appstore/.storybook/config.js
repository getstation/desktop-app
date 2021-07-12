import * as React from 'react';
import { ThemeProvider } from 'react-jss'
import { addDecorator, configure } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';
import { withNotes } from '@storybook/addon-notes';
import { withInfo } from '@storybook/addon-info';

import { BrowserXThemeProvider, withBrowserXTheme } from '@getstation/theme';
import StoryRouter from 'storybook-react-router';

withOptions({
  name: 'Station AppStore Styleguide v' + require('../package.json').version,
  hierarchySeparator: /\//,
  hierarchyRootSeparator: /\|/,
});

const req = require.context('../src', true, /stories.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

const style = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'white',
  minWidth: '300px',
  WebkitOverflowScrolling: 'touch',
  overflow: 'visible',
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
                  sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  fontWeight: 'normal',
  WebkitFontSmoothing: 'antialiased',
};

// Used to extract `react-jss`'s Theme provided with `react-jss` v8
// in `@getstation/theme` and provide it back in `react-jss` v10.
// @ts-ignore theme types mismatch
const ThemeForwarder = withBrowserXTheme(ThemeProvider);

addDecorator((story) => (
  <BrowserXThemeProvider>
    <ThemeForwarder>
      <div style={style} >
        {story()}
      </div>
    </ThemeForwarder>
  </BrowserXThemeProvider>
));

addDecorator(withNotes);
addDecorator(withInfo);
addDecorator(StoryRouter());

configure(loadStories, module);
