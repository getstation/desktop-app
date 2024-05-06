import { colors } from '@src/theme';

const styles = {
  section: {
    height: '100%',
  },
  container: {
    padding: [30, 20, 0, 20],
  },
  goBackBtn: {
    display: 'inline-block',
    fontSize: 13,
    fontWeight: 500,
    color: colors.blueGray100,
    paddingLeft: 25,
    marginBottom: 30,
    opacity: .77,
    position: 'relative',
    cursor: 'pointer',
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 3,
      left: 0,
      width: 3,
      height: 3,
      border: `solid ${colors.blueGray100}`,
      borderWidth: [0, 3, 3, 0],
      borderRadius: '1.2px',
      padding: 3,
      opacity: .5,
      transform: 'rotate(135deg)',
    },
  },
  stepperContainer: {
    maxWidth: 330,
    minHeight: 450,
    margin: '0 auto',
    overflowX: 'hidden',
    position: 'relative',
  },
  '@media (min-width: 600px)': {
    container: {
      padding: [30, 45, 0, 45],
    },
  },
};

export interface AppStoreMyCustomAppsClasses {
  section: string,
  container: string,
  goBackBtn: string,
  stepperContainer: string,
}

export default styles;
