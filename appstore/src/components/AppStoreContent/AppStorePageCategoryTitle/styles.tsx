import { colors } from '@src/theme';
import { AppStorePageCategoryTitleProps } from '@src/components/AppStoreContent/AppStorePageCategoryTitle/AppStorePageCategoryTitle';

const styles = {
  categoryTitle: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingRight: 10,
    paddingBottom: 12,
    marginBottom: ({ subTitle }: AppStorePageCategoryTitleProps) => subTitle ? 10 : 0,
    position: 'relative',
    '&:before': {
      content: '""',
      display: 'block',
      width: '100%',
      height: 2,
      position: 'absolute',
      bottom: 0,
      left: 0,
      backgroundColor: `${colors.blueGlowing}`,
      borderRadius: '2.5px',
    },
  },
  categoryIcon: {
    width: 24,
    minWidth: 24,
    height: 24,
    marginRight: 10,
  },
  categoryName: {
    fontFamily: 'Asap',
    fontSize: 24,
    fontWeight: 500,
    color: colors.blueGray100,
    letterSpacing: 0.42,
  },
  categorySubtitle: {
    fontSize: 14,
    color: colors.blueGray100,
    opacity: 0.7,
  },
};

export interface AppStorePageCategoryTitleClasses {
  categoryTitle: string,
  categoryIcon: string,
  categoryName: string,
  categorySubtitle: string,
  resultsContent: string,
}

export default styles;
