import { colors } from '@src/theme';

const styles = {
  navButton: {
    listStyleType: 'none',
    minHeight: 36,
    paddingLeft: 30,
    paddingRight: 10,
    color: colors.blueGray100,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color .2s',
    '&:hover $content': {
      transform: 'translateX(7px)',
      transition: 'transform .3s',
    },
  },
  activeNavButton: {
    backgroundColor: colors.hoverBlue,
    transition: 'background-color .2s',
  },
  content: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    transition: 'transform .3s',
  },
  title: {
    color: colors.blueGray100,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  titleName: {
    marginRight: 4,
  },
  icon: {
    minWidth: '14px',
    width: '14px',
    height: '14px',
    marginRight: '12px',
  },
  '@media (min-width: 600px)': {
    navButton: {
      paddingLeft: 21,
    },
  },
};

export interface IClasses {
  navButton: string,
  activeNavButton: string,
  content: string,
  title: string,
  titleName: string,
  icon: string,
}

export default styles;
