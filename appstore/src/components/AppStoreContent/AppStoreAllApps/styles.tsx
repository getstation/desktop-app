import { colors } from '@src/theme';

const styles = {
  '@keyframes slideRight': {
    from: { transform: 'translateX(-230px)' },
    to: { transform: 'translateX(0)' },
  },
  allAppsSection: {
    display: 'flex',
  },
  categoriesContainer: {
    margin: [0, 70, 0, 0],
    display: 'none',
    visibility: 'hidden',
    height: 0,
  },
  categoriesList: {
    minWidth: 230,
    maxWidth: 230,
    backgroundColor: colors.blueGray10,
    margin: 0,
    padding: [20, 13],
    borderRadius: [0, 30, 30, 0],
    listStyleType: 'none',
    animationName: 'slideRight',
    animationDuration: '.3s',
  },
  categoriesItem: {
    display: 'flex',
    alignItems: 'center',
    padding: [5, 12],
    borderRadius: '15.5px',
    marginBottom: 14,
    cursor: 'pointer',
    transition: 'background-color .3s',
    '&:last-child': {
      marginBottom: 0,
    },
    '&.isActive': {
      backgroundColor: colors.blueGray30,
      transition: 'background-color .3s',
    },
  },
  categoryIcon: {
    width: 24,
    minWidth: 24,
    height: 24,
    alignSelf: 'flex-start',
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.blueGray100,
  },
  dropDown: {
    width: '100%',
    position: 'fixed',
    top: 126,
    left: 0,
    backgroundColor: colors.blueGray30,
    zIndex: 10,
  },
  dropDownTitleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: [17, 21],
    cursor: 'pointer',
  },
  dropDownTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.blueGray100,
  },
  dropDownIcon: {
    display: 'inline-block',
    width: 12,
    height: 12,
    background: 'url("/static/all-apps-sprite.svg#i--dropdown-arrow") no-repeat',
    backgroundPosition: 'center',
    transition: 'transform .3s',
    '&.isActive': {
      transform: 'rotate(180deg)',
      transition: 'transform .3s',
    },
  },
  dropDownCategoriesList: {
    width: '100%',
    maxHeight: 0,
    padding: 0,
    margin: 0,
    listStyleType: 'none',
    overflowY: 'auto',
    transition: 'max-height .3s',
    '&.isActive': {
      maxHeight: 225,
      margin: [0, 0, 25, 0],
      transition: 'max-height .3s',
    },
  },
  dropDownCategoriesItem: {
    padding: [10, 21],
    cursor: 'pointer',
    transition: 'background-color .3s',
    '&.isActive': {
      backgroundColor: '#c8deea',
      transition: 'background-color .3s',
    },
  },
  '@media (min-width: 600px)': {
    dropDown: {
      position: 'fixed',
      top: 0,
      left: 200,
      width: 'calc(100% - 200px)',
    },
  },
  '@media (min-width: 1024px)': {
    categoriesContainer: {
      display: 'block',
      visibility: 'visible',
      height: 'auto',
    },
    dropDown: {
      display: 'none',
    },
  },
};

export interface AppStoreAllAppsClasses {
  allAppsSection: string,
  categoriesContainer: string,
  categoriesList: string,
  categoriesItem: string,
  categoryIcon: string,
  categoryText: string,
  dropDown: string,
  dropDownTitleContainer: string,
  dropDownTitle: string,
  dropDownIcon: string,
  dropDownCategoriesList: string,
  dropDownCategoriesItem: string,
  dropDownCategoryText: string,
}

export default styles;
