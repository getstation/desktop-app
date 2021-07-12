import { colors } from '@src/theme';
import { ThemeTypes } from '@getstation/theme';
import { AppRequestStepsChooserItemProps }
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsChooserItem/AppRequestStepsChooserItem';

const styles = (theme: ThemeTypes) => ({
  itemContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    border: `1px solid ${theme.colors.gray.light}`,
    borderRadius: theme.$borderRadius,
    padding: 10,
    margin: '10px auto 10px',
    ...theme.fontMixin(13),
    '&:hover': {
      backgroundColor: theme.colors.gray.light,
    },
  },
  itemContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: 500,
  },
  itemSubtitle: {
    fontSize: 11,
    color: theme.colors.gray.middle,
    marginTop: 2,
  },
  itemButton: {
    backgroundColor: ({ btnBgColor }: AppRequestStepsChooserItemProps) =>
      btnBgColor ? btnBgColor : colors.stationBlue,
    fontFamily: 'HelveticaNeue',
    fontSize: 11,
    fontWeight: 700,
    color: '#fff',
    padding: [8, 21, 10],
    border: 0,
    borderRadius: 40,
    cursor: 'pointer',
    outline: 'none',
    opacity: .8,
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.8)',
    },
  },
});

export interface AppRequestStepsChooserItemClasses {
  itemContainer: string,
  itemContent: string,
  itemTitle: string,
  itemSubtitle: string,
  itemButton: string,
}

export default styles;
