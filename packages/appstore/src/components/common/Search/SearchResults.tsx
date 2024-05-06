import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { colors } from '@src/theme';
import Application, { Props as ApplicationProps } from '@src/components/common/Application/Application';

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    width: '435px',
    maxHeight: '400px',
    overflowY: 'hidden',
  },
  description: {
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '0.25px',
    color: colors.blueGray100,
    position: 'relative',
  },
  listContainer: {
    maxHeight: '400px',
    overflowY: 'auto',
    '&:after': {
      content: '""',
      position: 'absolute',
      top: '350px',
      width: '100%',
      height: '50px',
      background: 'linear-gradient(rgba(255, 255, 255, 0.05), white)',
      pointerEvents: 'none',
    },
  },
  list: {
    margin: 0,
    padding: 0,
    columns: 2,
    paddingBottom: 70,
  },
  listItem: {
    listStyleType: 'none',
    display: 'inline-block',
  },
});

type Props = {
  applications: ApplicationProps[],
  title?: string,
};

const SearchResults = ({
  applications,
  title,
}: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {title &&
        <h3 className={classes.description}>{title}</h3>
      }
      <div className={classes.listContainer}>
        <ul className={classes.list}>
          {applications.map((
            {
              id,
              name,
              categoryName,
              iconURL,
              themeColor,
              isExtension,
              shouldDisplayCategory,
              onSelect,
              startUrl,
              isPreconfigurable,
              preconfigurations,
            },
            index) => (
              <li key={index} className={classes.listItem}>
                <Application
                  id={id}
                  name={name}
                  categoryName={categoryName}
                  iconURL={iconURL}
                  themeColor={themeColor}
                  isExtension={isExtension}
                  shouldDisplayCategory={shouldDisplayCategory}
                  onSelect={onSelect}
                  startUrl={startUrl}
                  isPreconfigurable={isPreconfigurable}
                  preconfigurations={preconfigurations}
                />
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchResults;
