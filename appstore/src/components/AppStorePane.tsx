import { createUseStyles } from 'react-jss';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import withAppModal, { WithAppModalStatusProps } from '@src/HOC/withAppModalStatus';
import withSearchString, { WithSearchStringProps } from '@src/HOC/withSearchString';
import { Application, ApplicationsAvailable } from '@src/graphql/queries';
import { ContextEnvPlatform } from '@src/app';
import { Switch, Route, useLocation } from 'react-router-dom';
import withCustomAppRequestMode from '@src/HOC/withCustomAppRequestMode';

import AppStoreHeader from './AppStoreHeader/AppStoreHeader';
import AppStoreAside from './AppStoreAside/AppStoreAside';
import AppStoreContent from './AppStoreContent/AppStoreContent';
import styles, { noPaneMatchers } from './styles';
import AppStoreSearchResults from './AppStoreContent/AppStoreSearchResults/AppStoreSearchResults';
import { MinimalApplication } from '../../../app/applications/graphql/withApplications';
import { PopularApps } from '../../../manifests';

const useStyles = createUseStyles(styles);

export interface AppStorePaneProps {
  applications: Application[],
  availableApplicationsToInstall?: string[],
  search: string,
  firstName: string,
  themeColors?: string[],
  onAddApplication: (applicationId: string, manifestURL: string) => void,
  appStoreContext: ContextEnvPlatform | undefined,
  onSearch: (query: string) => Promise<{ body: MinimalApplication[] }>,
  mostPopularApps?: PopularApps,
  allCategories: string[],
  applicationsByCategory: Record<string, MinimalApplication[]>,
}

export type State = {
  applicationsAvailable: ApplicationsAvailable[],
};

export type Props =
  {activeScreenName: any } &
  ChildProps<AppStorePaneProps>
  & WithAppModalStatusProps
  & WithSearchStringProps
  & { location: Location };

const AppStorePaneImpl: React.FC<Props> = (props) => {
  const {
    onAddApplication,
    appStoreContext,
    searchStringAfterEnterPress,
    isEnterPressed,
    onSearch,
    mostPopularApps,
    allCategories,
    applicationsByCategory,
  } = props;

  const { pathname } = useLocation();

  const classes = useStyles({ ...props, pathname });

  const [showPane, setShowPane] = React.useState<boolean>(true);

  React.useLayoutEffect(() => {
    const isMatching = noPaneMatchers.some(regexp => pathname.match(regexp));
    isMatching
      ? setShowPane(false)
      : setShowPane(true);
  }, [pathname]);

  const shouldShowSearchResult = searchStringAfterEnterPress && isEnterPressed;

  return (
    <div className={classes!.appStore}>
      <AppStoreHeader />
      <div className={classes!.wrapper}>
        { showPane &&
          <AppStoreAside />
        }
        <main className={classes!.main}>
          {shouldShowSearchResult &&
            <AppStoreSearchResults
              appStoreContext={appStoreContext}
              searchValue={searchStringAfterEnterPress}
              currentSearch={props.searchString}
              onAddApplication={onAddApplication}
              search={onSearch}
            />
          }
          {!shouldShowSearchResult &&
            <Switch>
              <Route path={'/'}>
                <AppStoreContent
                  onAddApplication={onAddApplication}
                  mostPopularApps={mostPopularApps}
                  allCategories={allCategories}
                  applicationsByCategory={applicationsByCategory}
                />
              </Route>
            </Switch>
          }
        </main>
      </div>
    </div>
  );
};

export default compose(
  withSearchString,
  withAppModal,
  withCustomAppRequestMode,
)(AppStorePaneImpl);
