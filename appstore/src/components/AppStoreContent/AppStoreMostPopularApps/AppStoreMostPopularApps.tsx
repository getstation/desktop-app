import * as React from 'react';
import injectSheet from 'react-jss';
import AppStorePageHeader from '@src/components/AppStoreContent/AppStorePageHeader/AppStorePageHeader';
import { WithMostPopularApplicationsProps } from '@src/HOC/withMostPopularApplications';
import AppStoreApplication from '@src/components/AppStoreContent/AppStoreApplicationItem/AppStoreApplication';
import { ContextEnvPlatform } from '@src/app';
import AppStorePageCategoryTitle
  from '@src/components/AppStoreContent/AppStorePageCategoryTitle/AppStorePageCategoryTitle';
import { scrollToTop } from '@src/shared/functions/scroll-to-top';
import AppStorePreloader from '@src/components/AppStorePreloader/AppStorePreloader';

import styles, { AppStoreMostPopularAppsClasses } from './styles';
import { PopularApps } from '../../../../../manifests';

export interface AppStoreMostPopularAppsProps extends WithMostPopularApplicationsProps {
  classes?: AppStoreMostPopularAppsClasses,
  appStoreContext: number,
  onAddApplication: (applicationId: string, manifestURL: string) => any,
  mostPopularApps?: PopularApps,
}

@injectSheet(styles)
class AppStoreMostPopularApps extends React.PureComponent<AppStoreMostPopularAppsProps> {

  componentDidMount() {
    scrollToTop();
  }

  render() {
    const { classes, loading, appStoreContext, onAddApplication, mostPopularApps: apps } = this.props;

    const title = 'Most Popular';
    const subTitle = 'The 100 most installed apps by the Station community';
    const alternate = (appStoreContext !== ContextEnvPlatform.Browser);

    const renderPageContent =
      apps && !loading && (!!apps.creamOfTheCropApps.length) && (!!apps.runnerUps.length) && (!!apps.noteworthy.length);

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
              {!!apps && !!apps.creamOfTheCropApps.length && <div>
                <AppStorePageCategoryTitle
                  title={'Cream of the crop'}
                  iconUrl={'/static/most-popular-apps-sprite.svg#i--cherry'}
                />
                <ul className={classes!.resultsContent}>
                  {apps.creamOfTheCropApps.map(app => {
                    return <AppStoreApplication
                      key={app.id}
                      application={app}
                      isExtension={app.isChromeExtension}
                      appStoreContext={appStoreContext}
                      alternate={alternate}
                      onAddApplication={onAddApplication}
                      marginBottom={20}
                    />;
                  })}
                </ul>
              </div>}

              {!!apps && !!apps.runnerUps.length && <div>
                <AppStorePageCategoryTitle
                  title={'Runner ups'}
                  iconUrl={'/static/most-popular-apps-sprite.svg#i--trainers'}
                />
                <ul className={classes!.resultsContent}>
                  {apps.runnerUps.map(app => {
                    return <AppStoreApplication
                      key={app.id}
                      application={app}
                      isExtension={app.isChromeExtension}
                      appStoreContext={appStoreContext}
                      alternate={alternate}
                      onAddApplication={onAddApplication}
                      marginBottom={20}
                    />;
                  })}
                </ul>
              </div>}

              {!!apps && !!apps.noteworthy.length && <div>
                <AppStorePageCategoryTitle
                  title={'Noteworthy'}
                  iconUrl={'/static/most-popular-apps-sprite.svg#i--like'}
                />
                <ul className={classes!.resultsContent}>
                  {apps.noteworthy.map(app => {
                    return <AppStoreApplication
                      key={app.id}
                      application={app}
                      isExtension={app.isChromeExtension}
                      appStoreContext={appStoreContext}
                      alternate={alternate}
                      onAddApplication={onAddApplication}
                      marginBottom={20}
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

export default AppStoreMostPopularApps;
