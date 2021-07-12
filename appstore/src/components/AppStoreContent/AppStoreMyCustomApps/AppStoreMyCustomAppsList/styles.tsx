const styles = {
  buttonContainer: {
    textAlign: 'center',
    marginTop: 30,
  },
  container: {
    padding: [30, 20, 0, 20],
  },
  resultsContent: {
    padding: [30, 0, 30],
    margin: 0,
    listStyleType: 'none',
    display: 'flex',
    flexWrap: 'wrap',
  },
  '@media (min-width: 600px)': {
    container: {
      padding: [40, 45, 57, 45],
    },
    resultsContent: {
      padding: [40, 0, 25],
    },
    buttonContainer: {
      display: 'none',
    },
  },
};

export interface AppStoreMyCustomAppsListClasses {
  buttonContainer: string,
  container: string,
  resultsContent: string,
}

export default styles;
