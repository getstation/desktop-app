import * as React from 'react';
import { ThemeProvider, jss, withTheme } from 'react-jss';
// @ts-ignore: no typing declaration for 'jss-nested'
import jssNested from 'jss-nested';
import { theme } from './jss';
import { ThemeTypes } from './types';

export interface BrowserXThemeProviderProps {
  children: any,
}

jss.use(jssNested());

/**
 * BrowserXThemeProvider
 */
export class BrowserXThemeProvider extends React.Component<BrowserXThemeProviderProps, {}> {
  render() {
    return (
      <ThemeProvider theme={theme}>
        {this.props.children}
      </ThemeProvider>
    );
  }
}

/**
 * Returns a component with an already passed `theme` with
 * current BrowserXTheme.
 */
export function withBrowserXTheme<P>(
  component: React.ComponentType<P & { theme: ThemeTypes }>
): React.ComponentType<Pick<P, Exclude<keyof P, 'theme'>>> {
  // @ts-ignore ?
  return withTheme(component);
}
