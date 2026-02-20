import React from 'react';
import type { Preview } from '@storybook/react';
import { ThemeProvider } from 'react-jss';
import { BrowserXThemeProvider, withBrowserXTheme } from '@getstation/theme';

const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'white',
  minWidth: '300px',
  WebkitOverflowScrolling: 'touch',
  overflow: 'visible',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontWeight: 'normal',
  WebkitFontSmoothing: 'antialiased',
};

// @ts-ignore theme types mismatch between legacy react-jss versions
const ThemeForwarder = withBrowserXTheme(ThemeProvider);

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
      },
    },
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },
  },
  decorators: [
    (Story) => (
      <BrowserXThemeProvider>
        <ThemeForwarder>
          <div style={style}>
            <Story />
          </div>
        </ThemeForwarder>
      </BrowserXThemeProvider>
    ),
  ],
};

export default preview;
