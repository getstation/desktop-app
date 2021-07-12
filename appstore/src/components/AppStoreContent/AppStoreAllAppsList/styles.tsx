import { colors } from '@src/theme';
import { block } from 'csstips';

const styles = {
  container: {
    padding: [80, 20, 100, 20],
  },
  resultsContent: {
    padding: [30, 0, 30],
    margin: 0,
    listStyleType: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  resultsNav: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsNavPrevCategoryBtn: {
    display: 'none',
    fontSize: 13,
    fontWeight: 500,
    color: colors.blueGray100,
    paddingLeft: 20,
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
    '&.isHidden': {
      visibility: 'hidden',
    },
  },
  resultsNavNextCategoryBtn: {
    display: 'none',
    fontSize: 13,
    fontWeight: 500,
    color: colors.blueGray100,
    paddingRight: 17,
    opacity: .77,
    position: 'relative',
    cursor: 'pointer',
    '&:after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 3,
      right: 0,
      width: 3,
      height: 3,
      border: `solid ${colors.blueGray100}`,
      borderWidth: [0, 3, 3, 0],
      borderRadius: '1.2px',
      padding: 3,
      opacity: .5,
      transform: 'rotate(-45deg)',
    },
    '&.isHidden': {
      visibility: 'hidden',
    },
  },
  resultsNavScrollBtnContainer: {
    width: 30,
    minWidth: 30,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: `1px solid ${colors.buttonBorder}`,
    borderRadius: '50%',
    textAlign: 'center',
    cursor: 'pointer',
  },
  resultNavScrollBtnIcon: {
    width: 12,
    height: 12,
  },
  '@media (min-width: 600px)': {
    container: {
      padding: [100, 35, 140, 45],
    },
    resultsContent: {
      padding: [40, 0, 50],
    },
  },
  '@media (min-width: 768px)': {
    resultsNav: {
      justifyContent: 'space-between',
    },
    resultsNavPrevCategoryBtn: {
      display: 'block',
    },
    resultsNavNextCategoryBtn: {
      display: 'block',
    },
  },
  '@media (min-width: 1024px)': {
    container: {
      padding: [50, 35, 140, 0],
    },
  },
};

export interface AppStoreAllAppsListClasses {
  container: string,
  resultsContent: string,
  resultsNav: string,
  resultsNavPrevCategoryBtn: string,
  resultsNavNextCategoryBtn: string,
  resultsNavScrollBtnContainer: string,
  resultNavScrollBtnIcon: string,
}

export default styles;
