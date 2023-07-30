import { ThemeTypes } from '@getstation/theme';
import { colors } from '@src/theme';

const styles = (theme: ThemeTypes) => ({
  resultsSection: {
    padding: '30px 20px 0 20px',
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 30,
    paddingBottom: 8,
    borderBottom: '1px solid #e8ebec',
  },
  resultsTitle: {
    fontFamily: 'Asap',
    fontSize: 18,
    fontWeight: 500,
    letterSpacing: 0.32,
    color: colors.blueGray100,
  },
  resultsAmount: {
    fontSize: 14,
    color: colors.blueGray100,
    opacity: 0.7,
  },
  resultsContent: {
    padding: '47px 0 32px 0',
    margin: 0,
    listStyleType: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  resultsButtonContainer: {
    textAlign: 'center',
    marginBottom: 52,
  },
  resultsButton: {
    display: 'inline-block',
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 500,
    color: colors.stationBlue,
    textAlign: 'center',
    padding: '9px 50px',
    border: `1px solid ${colors.buttonBorder}`,
    borderRadius: '18.5px',
    cursor: 'pointer',
  },
  '@media (min-width: 600px)': {
    resultsSection: {
      padding: [34, 38, 0, 42],
    },
    resultsButtonContainer: {
      marginBottom: 70,
    },
  },
});

export interface AppStoreSearchResultsClasses {
  resultsSection: string,
  resultsHeader: string,
  resultsTitle: string,
  resultsAmount: string,
  resultsContent: string,
  resultsButtonContainer: string,
  resultsButton: string,
}

export default styles;
