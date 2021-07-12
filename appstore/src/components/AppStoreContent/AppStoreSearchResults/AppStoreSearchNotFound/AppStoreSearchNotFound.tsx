import * as React from 'react';
import injectSheet from 'react-jss';
import { ContextEnvPlatform } from '@src/app';
import { Size } from '@getstation/theme';
import AppRequestButton from '@src/components/AppStoreContent/AppStoreRequest/AppRequestButton/AppRequestButton';

import styles, { AppStoreSearchNotFoundClasses } from './styles';

export interface AppStoreSearchNotFoundProps {
  classes?: AppStoreSearchNotFoundClasses,
  appStoreContext: number,
  searchValue: string,
}

@injectSheet(styles)
class AppStoreSearchNotFound extends React.PureComponent<AppStoreSearchNotFoundProps, {}> {
  render() {
    const {
      classes,
      searchValue,
      appStoreContext,
    } = this.props;

    return (
      <section className={classes!.notFoundPage}>
        <div className={classes!.content}>
          <div className={classes!.title}>
            <span className={classes!.text}>There's no results for </span>
            <span> &laquo; {searchValue} &raquo;</span>
          </div>

          {appStoreContext !== ContextEnvPlatform.Browser && <AppRequestButton
            btnSize={Size.BIG}
          >
            <div>
              <span className={classes!.button}>Can't find your app? Add it!</span>
            </div>
          </AppRequestButton>}
        </div>
      </section>
    );
  }
}

export default AppStoreSearchNotFound;
