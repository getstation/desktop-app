import * as React from 'react';
import { createUseStyles } from 'react-jss';
import Search from '@src/components/common/Search/Search';
import SearchResults from '@src/components/common/Search/SearchResults';
import { colors } from '@src/theme';

import { Application } from '../Application.type';

const useStyles = createUseStyles({
  container: {
    maxWidth: '400px',
  },
  input: {
    marginBottom: '20px',
  },
  results: {},
  continue: {
    marginTop: 32,
    '& > button': {
      backgroundColor: [colors.stationBlue, '!important'],
    },
    '& > button.invalid': {
      '&:focus': {
        outlineColor: 'red',
        animation: '$shake .5s linear',
      },
    },
  },
  '@keyframes shake': {
    '8%, 41%': {
      transform: 'translateX(-10px)',
    },
    '25%, 58%': {
      transform: 'translateX(10px)',
    },
    '75%': {
      transform: 'translateX(-5px)',
    },
    '92%': {
      transform: 'translateX(5px)',
    },
    '0%, 100%': {
      transform: 'translateX(0)',
    },
  },
});

type Props = {
  applications: Application[],
  title?: string,
  query: string,
  onQueryChange: (query: string) => void,
  onSelectApplication: (applicationId: string) => void,
  searchInputRef?: React.Ref<HTMLInputElement>,
};

const AppStoreSearch = ({
  applications,
  title,
  onQueryChange,
  onSelectApplication,
  query,
  searchInputRef,
}: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.input}>
        <Search ref={searchInputRef} query={query} onQueryChange={onQueryChange} />
      </div>
      <div className={classes.results}>
        <SearchResults
          applications={applications.map(app => ({ ...app, onSelect: onSelectApplication, shouldDisplayCategory: false }))}
          title={title}
        />
      </div>
    </div>
  );
};

export default AppStoreSearch;
