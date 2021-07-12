import * as React from 'react';
import injectSheet from 'react-jss';
import AppRequestButton from '@src/components/AppStoreContent/AppStoreRequest/AppRequestButton/AppRequestButton';
import { Size } from '@getstation/theme';
import AppStorePageCategoryTitle
  from '@src/components/AppStoreContent/AppStorePageCategoryTitle/AppStorePageCategoryTitle';
import AppStoreApplication from '@src/components/AppStoreContent/AppStoreApplicationItem/AppStoreApplication';
import AppStoreCustomAppsNotFound
  from '@src/components/AppStoreContent/AppStoreMyCustomApps/AppStoreCustomAppsNotFound/AppStoreCustomAppsNotFound';
import styles, { AppStoreMyCustomAppsListClasses }
  from '@src/components/AppStoreContent/AppStoreMyCustomApps/AppStoreMyCustomAppsList/styles';
import {
  WithCustomApplicationsProps,
} from '@src/HOC/withCustomApplications';
import { ContextEnvPlatform } from '@src/app';

export interface AppStoreRenderAppsComponentProps {
  classes?: AppStoreMyCustomAppsListClasses,
  appStoreContext: number,
  renderPrivateApps: boolean,
  onAddApplication: (applicationId: string, manifestURL: string) => any,
}

type AppStoreMyCustomAppsProps = AppStoreRenderAppsComponentProps & WithCustomApplicationsProps ;

@injectSheet(styles)

class AppStoreMyCustomAppsList extends React.PureComponent<AppStoreMyCustomAppsProps, {}> {
  render() {
    const {
      classes,
      appStoreContext,
      renderPrivateApps,
      privateApps,
      onAddApplication,
    } = this.props;

    const alternate = (appStoreContext !== ContextEnvPlatform.Browser);

    return (
      <React.Fragment>
        {renderPrivateApps ?
          <React.Fragment>
            <div className={classes!.buttonContainer}>
              <AppRequestButton
                btnSize={Size.SMALL}
              />
            </div>
            <div className={classes!.container}>
              {!!privateApps && !!privateApps.length &&
                <div>
                  <AppStorePageCategoryTitle
                    title={'Private Apps'}
                    subTitle={'Visible only to you.'}
                    iconUrl={'/static/custom-apps-sprite.svg#i--lock'}
                  />
                  <ul className={classes!.resultsContent}>
                    {privateApps.map(app => {
                      return <AppStoreApplication
                        key={app.id}
                        application={app}
                        isExtension={app.isChromeExtension}
                        appStoreContext={appStoreContext}
                        alternate={alternate}
                        onAddApplication={onAddApplication}
                        marginBottom={25}
                      />;
                    })}
                  </ul>
                </div>
              }
            </div>

          </React.Fragment>
          :
          <AppStoreCustomAppsNotFound>
            <AppRequestButton
              btnSize={Size.BIG}
            />
          </AppStoreCustomAppsNotFound>
        }
      </React.Fragment>
    );
  }
}

export default AppStoreMyCustomAppsList;
