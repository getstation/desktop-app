import * as React from 'react';
import injectSheet from 'react-jss';
import { flowRight as compose } from 'lodash';
import AppStorePageHeader from '@src/components/AppStoreContent/AppStorePageHeader/AppStorePageHeader';
import { boostedApplications, WithBoostedApplicationsProps } from '@src/HOC/withBoostedApplications';
import AppStoreApplication from '@src/components/AppStoreContent/AppStoreApplicationItem/AppStoreApplication';
import { ContextEnvPlatform } from '@src/app';
import { boostedTypes } from '@src/shared/constants/constants';
import AppStorePageCategoryTitle
  from '@src/components/AppStoreContent/AppStorePageCategoryTitle/AppStorePageCategoryTitle';
import { scrollToTop } from '@src/shared/functions/scroll-to-top';
import AppStorePreloader from '@src/components/AppStorePreloader/AppStorePreloader';

import styles, { AppStoreBoostedAppsClasses } from './styles';

export interface AppStoreBoostedAppsProps extends WithBoostedApplicationsProps {
  classes?: AppStoreBoostedAppsClasses,
  appStoreContext: number,
  onAddApplication: (applicationId: string, manifestURL: string) => any,
}

@injectSheet(styles)
class AppStoreBoostedApps extends React.PureComponent<AppStoreBoostedAppsProps, {}> {

  componentDidMount() {
    scrollToTop();
  }

  render() {
    const {
      classes,
      appStoreContext,
      onAddApplication,
      appNotificationBadge,
      appStatusSync,
    } = this.props;
    const title = 'Boosted apps';
    const subTitle = `Apps that are more deeply integrated with Station.
    Nothing to do on your side, these additional features are automatically activated.`;
    const alternate = (appStoreContext !== ContextEnvPlatform.Browser);
    const renderAppNotificationBadge = !!appNotificationBadge && !!appNotificationBadge.length;
    const renderAppStatusSync = !!appStatusSync && !!appStatusSync.length;

    const loading = false;

    const appsUnifiedSearch = boostedApplications().apps;
    const renderAppsUnifiedSearch = !!appsUnifiedSearch && !!appsUnifiedSearch.length;

    const renderPageContent = (renderAppsUnifiedSearch || renderAppNotificationBadge || renderAppStatusSync) && !loading;

    return (
      <React.Fragment>
        {!renderPageContent ?
          <AppStorePreloader isAnimationStopped={!!renderPageContent}/>
          :
          <section>
            <AppStorePageHeader
              title={title}
              subTitle={subTitle}
            />
            <div className={classes!.container}>
              {renderAppsUnifiedSearch && <div>
                <AppStorePageCategoryTitle
                  title={boostedTypes.unifiedSearch.title}
                  subTitle={'Find everything via CMD+T'}
                  iconUrl={'/static/boosted-apps-sprite.svg#i--magnifier'}
                />
                <ul className={classes!.resultsContent}>
                  {!!appsUnifiedSearch && appsUnifiedSearch.map(app => {
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
              </div>}

              {renderAppNotificationBadge && <div>
                <AppStorePageCategoryTitle
                  title={boostedTypes.notificationBadge.title}
                  subTitle={'A red dot tells you that something new happened'}
                  iconUrl={'/static/boosted-apps-sprite.svg#i--badge'}
                />
                <ul className={classes!.resultsContent}>
                  {!!appNotificationBadge && appNotificationBadge.map(app => {
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
              </div>}

              {renderAppStatusSync && <div>
                <AppStorePageCategoryTitle
                  title={boostedTypes.statusSync.title}
                  subTitle={'Your status changes to let people know you\'ve disabled notifications'}
                  iconUrl={'/static/boosted-apps-sprite.svg#i--mute'}
                />
                <ul className={classes!.resultsContent}>
                  {!!appStatusSync && appStatusSync.map(app => {
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
              </div>}
            </div>
          </section>
        }
      </React.Fragment>
    );
  }
}

export default AppStoreBoostedApps;
