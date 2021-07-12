import { ContextEnvPlatform } from '@src/app';
import { AppStoreContext } from '@src/context';
import * as React from 'react';
import injectSheet from 'react-jss';

import styles, { AppStoreHeaderClasses } from './styles';

type InjectSheetProps = {
  classes: AppStoreHeaderClasses,
};

export type OwnProps = {};

type Props = OwnProps & InjectSheetProps;

@injectSheet(styles)
class AppStoreHeader extends React.PureComponent<Props, {}> {
  render() {
    const { classes } = this.props;
    return (
      <AppStoreContext.Consumer>
        {(appStoreContext) => (
          <header className={classes.header}>
            {appStoreContext === ContextEnvPlatform.Browser &&
              <div className={classes.headerBanner}>
                <form action="https://dl.getstation.com/download" method="get">
                  <span>All your web applications in a single place</span>
                  <button className={classes.downloadLink} type="submit">Download Station</button>
                </form>
              </div>
            }

            {appStoreContext === ContextEnvPlatform.LegacyBxApiApp &&
              <div className={classes.headerBanner}>
                You are using an outdated version of Station with missing features. Stay safe and restart your Station.
              </div>
            }
          </header>
        )}
      </AppStoreContext.Consumer>
    );
  }
}

export default AppStoreHeader as React.ComponentType<OwnProps>;
