import { colors } from '@src/theme';

const styles = {
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: [32, 45],
    borderBottom: `1px solid ${colors.blueGray30}`,
    minHeight: 127,
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 60,
    minWidth: 60,
    height: 60,
    borderRadius: '50%',
    overflow: 'hidden',
    marginRight: 31,
  },
  icon: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
  description: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontFamily: 'Asap',
    fontSize: 28,
    fontWeight: 500,
    color: colors.blueGray100,
    marginBottom: 10,
    marginTop: 0,
  },
  subTitle: {
    fontSize: 14,
    color: colors.blueGray100,
    opacity: 0.7,
  },
  '@media (max-width: 599px)': {
    pageHeader: {
      display: 'none',
    },
  },
};

export interface AppStorePageHeaderClasses {
  pageHeader: string,
  content: string,
  iconContainer: string,
  icon: string,
  description: string,
  title: string,
  subTitle: string,
}

export default styles;
