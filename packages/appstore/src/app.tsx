import { BrowserXThemeProvider, withBrowserXTheme } from '@getstation/theme';
import AppStorePane from '@src/components/AppStorePane';
import Client from '@src/graphql/Client';
import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ThemeProvider } from 'react-jss';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { AppStoreContext, ContextEnvPlatform } from './context';
import { MinimalApplication } from '../../app/src/applications/graphql/withApplications';
import { PopularApps } from '../../app/manifests';

export { ContextEnvPlatform };

// Used to extract `react-jss`'s Theme provided with `react-jss` v8
// in `@getstation/theme` and provide it back in `react-jss` v10.
// @ts-ignore theme types mismatch
const ThemeForwarder = withBrowserXTheme(ThemeProvider);

interface IStateProps {
  foo: string;
}

interface IDispatchProps {
  action: () => null,
}

type Props = IStateProps & IDispatchProps;

interface IState {
  appStoreContext?: ContextEnvPlatform,
  apiClient?: any,
  availableApplicationsToInstall?: string[],
  themeColors?: string[],
  installApplication?: (applicationId: string, manifestURL: string) => void,
  search?: (query: string) => Promise<{ body: MinimalApplication[] }>,
  mostPopularApps?: PopularApps,
  allCategories: string[],
  applicationsByCategory: Record<string, MinimalApplication[]>;
}

class AppImpl extends React.Component<Props, IState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      appStoreContext: undefined,
      apiClient: undefined,
      availableApplicationsToInstall: undefined,
      themeColors: undefined,
      installApplication: undefined,
      mostPopularApps: undefined,
      allCategories: [],
      applicationsByCategory: {},
    };
  }

  // tslint:disable-next-line function-name
  async UNSAFE_componentWillMount() {
    if ('bx' in window) {
      // @ts-ignore : bx attached to window
      const bxApi = window.bx;

      // bxApi.theme.themeColors.subscribe((themeColors: string[]) =>
      //   this.setState({ themeColors }));
        
      bxApi.theme.addThemeColorsChangeListener((_: any, themeColors: string[]) => {
        this.setState({ themeColors })
      });

      if ('applications' in bxApi) {
        this.setState({
          appStoreContext: ContextEnvPlatform.App,
        });

        const applicationsBxApi = bxApi.applications;
        this.setState({
          installApplication: (applicationId: string, manifestURL: string) => applicationsBxApi.install({
            manifestURL,
            context: {
              id: applicationId,
              platform: 'appstore',
            },
            inBackground: true,
          }),
          search: applicationsBxApi.search,
        });

        applicationsBxApi.getMostPopularApps().then(mostPopularApps => {
          this.setState({ mostPopularApps: mostPopularApps.body });
        });

        applicationsBxApi.getAllCategories().then((categories) => {
          this.setState({ allCategories: categories.body });
        });

        applicationsBxApi.getApplicationsByCategory().then(res => {
          this.setState({ applicationsByCategory: res.body });
        });

      } else {
        this.setState({ appStoreContext: ContextEnvPlatform.Browser });
      }
    }
  }

  render() {
    const {
      themeColors, availableApplicationsToInstall,
      installApplication, appStoreContext, search, allCategories, mostPopularApps, applicationsByCategory,
    } = this.state;

    return (
      <AppStoreContext.Provider value={appStoreContext}>
        <ApolloProvider client={Client}>
          <BrowserXThemeProvider>
            <ThemeForwarder>
              <Router>
                <div>
                  <AppStorePane
                    appStoreContext={appStoreContext}
                    availableApplicationsToInstall={availableApplicationsToInstall}
                    themeColors={themeColors}
                    onAddApplication={(applicationId: string, manifestURL: string) =>
                      installApplication!(applicationId, manifestURL)
                    }
                    onSearch={search}
                    mostPopularApps={mostPopularApps}
                    allCategories={allCategories}
                    applicationsByCategory={applicationsByCategory}
                  />
                </div>
              </Router>
            </ThemeForwarder>
          </BrowserXThemeProvider>
        </ApolloProvider>
      </AppStoreContext.Provider>
    );
  }
}

const App = connect<{}, {}, IStateProps, IDispatchProps>(
  (state) => ({
    foo: 'bar',
  }),
  (dispatch: Dispatch) => bindActionCreators(
    {
      action: () => null,
    },
    dispatch,
  )
)(AppImpl);

export default App;
