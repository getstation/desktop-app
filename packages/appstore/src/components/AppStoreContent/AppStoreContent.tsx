import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { flowRight as compose } from 'lodash';
import { ContextEnvPlatform } from '@src/app';
import { AppStoreContext } from '@src/context';
import { screenHash } from '@src/shared/constants/constants';
import AppStoreMostPopularApps from '@src/components/AppStoreContent/AppStoreMostPopularApps/AppStoreMostPopularApps';
import AppStoreAllApps from '@src/components/AppStoreContent/AppStoreAllApps/AppStoreAllApps';
import AppStoreAllExtensions from '@src/components/AppStoreContent/AppStoreAllExtensions/AppStoreAllExtensions';
import AppStoreBoostedApps from '@src/components/AppStoreContent/AppStoreBoostedApps/AppStoreBoostedApps';
import AppStoreMyCustomApps from '@src/components/AppStoreContent/AppStoreMyCustomApps/AppStoreMyCustomApps';
import withCustomAppRequestMode, { WithCustomAppRequestModeStatus } from '@src/HOC/withCustomAppRequestMode';
import { MinimalApplication } from '../../../../app/applications/graphql/withApplications';
import { PopularApps } from '../../../../manifests';

export interface AppStoreContentComponentProps {
  onAddApplication: (applicationId: string, manifestURL: string) => void,
  availableApplicationsToInstall: string[],
  mostPopularApps?: PopularApps,
  allCategories: string[],
  applicationsByCategory: Record<string, MinimalApplication[]>,
}

type AppStoreContentProps = AppStoreContentComponentProps
  & WithCustomAppRequestModeStatus;

const AppStoreContent = (
  props: AppStoreContentProps,
) => {
  const { hash } = useLocation();

  const getCurrentScreen = (appStoreContext?: ContextEnvPlatform) => {
    const {
      onAddApplication,
      mostPopularApps,
      allCategories,
      applicationsByCategory,
    } = props;

    switch (hash) {
      case '':
      case screenHash.MOST_POPULAR:
        return (
          <AppStoreMostPopularApps
            appStoreContext={appStoreContext}
            onAddApplication={onAddApplication}
            mostPopularApps={mostPopularApps}
          />);
      case screenHash.ALL_APPS:
        return (
          <AppStoreAllApps
            appStoreContext={appStoreContext}
            onAddApplication={onAddApplication}
            allCategories={allCategories}
            applicationsByCategory={applicationsByCategory}
          />);
      case screenHash.ALL_EXTENSIONS:
        return (
          <AppStoreAllExtensions
            appStoreContext={appStoreContext}
            onAddApplication={onAddApplication}
          />);
      case screenHash.BOOSTED_APPS:
        return (
          <AppStoreBoostedApps
            appStoreContext={appStoreContext}
            onAddApplication={onAddApplication}
          />);
      case screenHash.MY_CUSTOM_APPS:
        return (
          <AppStoreMyCustomApps
            appStoreContext={appStoreContext}
            onAddApplication={onAddApplication}
          />
        );
      //  todo: review what exact component we should return on default
      default: return <React.Fragment />;
    }
  };

  return (
    <AppStoreContext.Consumer>
      {(appStoreContext) => (
        <React.Fragment>
          {getCurrentScreen(appStoreContext)}
        </React.Fragment>
      )}
    </AppStoreContext.Consumer>
  );
};

export default compose(
  withCustomAppRequestMode,
)(AppStoreContent);
