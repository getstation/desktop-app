import * as React from 'react';
import injectSheet from 'react-jss';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { SET_SEARCH_STRING } from '@src/graphql/schemes/search';
import { MutateSetSearchStringProps } from '@src/graphql/types/mutateSetSearchString';

import styles, { AppStoreCustomAppsNotFoundClasses } from './styles';

export interface AppStoreCustomAppsNotFoundProps {
  classes?: AppStoreCustomAppsNotFoundClasses,
}

type Props = AppStoreCustomAppsNotFoundProps & MutateSetSearchStringProps;

@injectSheet(styles)
class AppStoreCustomAppsNotFound extends React.PureComponent<Props, {}> {

  redirect() {
    this.props.mutateSetSearchString({
      variables: {
        searchString: '',
        searchStringAfterEnterPress: '',
        isEnterPressed: false,
      },
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes!.notFoundPage}>
        <div className={classes!.content}>
          <div className={classes!.title}>
            You don't have any custom app
          </div>
          <div className={classes!.description}>
            <div className={classes!.text}>
              More than 600 apps are supported by Station.
            </div>
            <div className={classes!.text}>
              If you can't find what you're looking for, just add any URL you wish here.
            </div>
          </div>

          {this.props.children}
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(SET_SEARCH_STRING, { name: 'mutateSetSearchString' }),
)(AppStoreCustomAppsNotFound);
