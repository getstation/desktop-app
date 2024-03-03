import { ThemeTypes } from '@getstation/theme';
import { colors } from '@src/theme';

const styles = (theme: ThemeTypes) => ({
  notFoundPage: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: [30, 20],
    '&:before': {
      display: 'block',
      content: '""',
      position: 'absolute',
      bottom: 65,
      right: -10,
      width: 286,
      height: 334,
      backgroundImage: 'url(/static/astro-shrug.png)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 286,
      backgroundPosition: 'center',
      zIndex: 0,
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    fontFamily: 'Asap',
    fontSize: 24,
    fontWeight: 500,
    color: colors.blueGray100,
    letterSpacing: 0.42,
    textAlign: 'center',
    marginBottom: 38,
  },
  text: {
    marginRight: 5,
  },
  button: {
    display: 'inline-block',
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    backgroundColor: colors.stationBlue,
    textAlign: 'center',
    padding: '12px 38px',
    borderRadius: 20,
    boxShadow: '0 2px 4px 0 rgba(22, 77, 156, 0.5)',
    cursor: 'pointer',
  },
  '@media (max-width: 1023px)': {
    notFoundPage: {
      '&:before': {
        display: 'none',
      },
    },
  },
});

export interface AppStoreSearchNotFoundClasses {
  notFoundPage: string,
  content: string,
  title: string,
  text: string,
  button: string,
}

export default styles;
