const styles = {
  resultsContent: {
    padding: [30, 20],
    margin: 0,
    listStyleType: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  '@media (min-width: 600px)': {
    resultsContent: {
      padding: [50, 45, 32, 45],
    },
  },
};

export interface AppStoreAllExtensionsClasses {
  resultsContent: string,
}

export default styles;
