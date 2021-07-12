import { ContextEnvPlatform } from '@src/app';
import { AppStorePaneProps, Props } from '@src/components/AppStorePane';
import { WithAppModalStatusProps } from '@src/HOC/withAppModalStatus';

export const noPaneMatchers = [/\/onboarding\/create/, /\/onboarding\/edit/];

const styles = {
  '@global': {
    body: {
      margin: 0,
      fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
                  sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
      fontWeight: 'normal',
      '-webkit-font-smoothing': 'antialiased',
    },
    '*': {
      boxSizing: 'border-box',
    },
  },

  appStore: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    overflow: ({ isAppModalOpen }: WithAppModalStatusProps) => isAppModalOpen ? 'hidden' : 'visible',
    minWidth: '300px',
    '-webkit-overflow-scrolling': 'touch',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: ({ appStoreContext }: AppStorePaneProps) => appStoreContext === ContextEnvPlatform.Browser ? 45 : undefined,
    height: '100%',
    '@media (min-width: 600px)': {
      flexDirection: 'row',
      height: '100vh',
    },
    '@media (min-width: 1280px)': {
      height: '100%',
    },
  },
  main: {
    width: '100%',
    height: ({ isAppModalOpen }: Props) => isAppModalOpen ? '100vh' : `calc(100vh - 127px)`,
    marginTop: ({ isAppModalOpen }: Props) => isAppModalOpen ? 0 : 127,
    paddingTop: ({ isAppModalOpen }: Props) => isAppModalOpen ? 127 : 0,
    position: 'relative',
    '@media (min-width: 1280px)': {
      marginTop: ({ appStoreContext }: AppStorePaneProps) => appStoreContext === ContextEnvPlatform.Browser ? `46px` : '0',
    },
    '@media (min-width: 600px)': {
      height: ({ appStoreContext }: AppStorePaneProps) => appStoreContext === ContextEnvPlatform.Browser ? `calc(100vh - 46px)` : '100vh',
      marginTop: () => 0,
      paddingTop: () => 0,
      paddingLeft: ({ pathname }: { pathname: string }) => {
        const isMatching = noPaneMatchers.some(regexp => pathname.match(regexp));
        return isMatching ? 0 : 200;
      },
    },
  },
};

export interface AppStorePaneClasses {
  body: string,
  appStore: string,
  wrapper: string,
  main: string,
}

export default styles;
