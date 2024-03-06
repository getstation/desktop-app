import { colors } from '@src/theme';
import { AppStorePaneProps } from '@src/components/AppStorePane';
import { ContextEnvPlatform } from '@src/app';

const styles = {
  aside: {
    width: '100%',
    maxWidth: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: colors.blueGray30,
    boxShadow: '0 1px 4px 0 rgba(48, 55, 64, 0.28)',
    zIndex: 20,
    // FIXME: don't rely on **override by order** for media queries
    // WARNING: if you use ordering for to override CSS rules,
    // might end up in a non determistic state
    '@media (min-width: 600px)': {
      width: 200,
      minWidth: 200,
      maxWidth: 200,
      height: '100%',
      borderRight: '1px solid rgba(48, 55, 64, 0.19)',
      boxShadow: 'unset',
    },
    '@media (min-width: 1280px)': {
      height: ({ appStoreContext }: AppStorePaneProps) => appStoreContext === ContextEnvPlatform.Browser ? `calc(100vh - 46px)` : '100vh',
      marginTop: ({ appStoreContext }: AppStorePaneProps) => appStoreContext === ContextEnvPlatform.Browser ? `46px` : '0',
    },
  },
  info: {
    display: 'none',
    '@media (min-width: 600px)': {
      display: 'flex',
      justifyContent: 'center',
      paddingBottom: 27,
    },
  },
  text: {
    fontSize: 11,
    fontWeight: 500,
    color: colors.blueGray100,
    marginRight: 5,
    opacity: 0.7,
  },
  logo: {
    width: 48,
    height: 13,
  },
};

export interface IClasses {
  aside: string,
  info: string,
  text: string,
  logo: string,
}

export default styles;
