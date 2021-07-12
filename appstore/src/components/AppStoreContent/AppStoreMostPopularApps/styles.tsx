const styles = {
  container: {
    padding: [30, 20, 0, 20],
  },
  resultsContent: {
    padding: [30, 0, 45],
    margin: 0,
    listStyleType: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  '@media (min-width: 600px)': {
    container: {
      padding: [40, 45, 20, 45],
    },
    resultsContent: {
      padding: [40, 0, 45],
    },
  },
};

export interface AppStoreMostPopularAppsClasses {
  container: string,
  resultsContent: string,
}

export default styles;
