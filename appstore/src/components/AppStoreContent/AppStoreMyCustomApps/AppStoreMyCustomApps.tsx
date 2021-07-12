import * as React from 'react';
import injectSheet from 'react-jss';
import { graphql, withApollo, WithApolloClient } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { Application } from '@src/graphql/queries';
import AppStorePageHeader from '@src/components/AppStoreContent/AppStorePageHeader/AppStorePageHeader';
import AppRequest from '@src/components/AppStoreContent/AppStoreRequest/AppRequest';
import { Size } from '@getstation/theme';
import withCustomApplications, { WithCustomApplicationsProps } from '@src/HOC/withCustomApplications';
import AppRequestButton from '@src/components/AppStoreContent/AppStoreRequest/AppRequestButton/AppRequestButton';
import withCustomAppRequestMode, { WithCustomAppRequestModeStatus } from '@src/HOC/withCustomAppRequestMode';
import withAppModal, { WithAppModalStatusProps } from '@src/HOC/withAppModalStatus';
import { scrollToTop } from '@src/shared/functions/scroll-to-top';
import AppStorePreloader from '@src/components/AppStorePreloader/AppStorePreloader';
import { customAppsMode } from '@src/shared/constants/constants';
import AppRequestModal from '@src/components/AppStoreContent/AppRequestModal/AppRequestModal';
import AppDeleteModalBody
  from '@src/components/AppStoreContent/AppStoreRequestEdit/AppDeleteModalBody/AppDeleteModalBody';
import AppStoreMyCustomAppsList
  from '@src/components/AppStoreContent/AppStoreMyCustomApps/AppStoreMyCustomAppsList/AppStoreMyCustomAppsList';
import initialState from '@src/graphql/initialClientState';
import { SET_SEARCH_STRING } from '@src/graphql/schemes/search';
import { SET_CUSTOM_APP_REQUEST_MODE } from '@src/graphql/schemes/customAppRequestMode';
import { SET_SELECTED_CUSTOM_APP } from '@src/graphql/schemes/selectedCustomApp';
import { SET_APP_MODAL_STATUS } from '@src/graphql/schemes/appModalStatus';
import { DELETE_APPLICATION } from '@src/graphql/schemes/deleteApplication';
import { MutateSetSearchStringProps } from '@src/graphql/types/mutateSetSearchString';
import { MutateSetCustomAppRequestModeProps } from '@src/graphql/types/mutateSetCustomAppRequestMode';
import { MutateSetSelectedCustomAppProps } from '@src/graphql/types/mutateSetSelectedCustomApp';
import { MutateSetAppModalStatusProps } from '@src/graphql/types/mutateSetAppModalStatus';
import { MutateDeleteApplicationProps } from '@src/graphql/types/mutateDeleteApplication';

import styles, { AppStoreMyCustomAppsClasses } from './styles';

export interface AppStoreMyCustomAppsComponentProps {
  classes?: AppStoreMyCustomAppsClasses,
  appStoreContext: number,
  apps?: Application[],
  currentSearch: string,
  onAddApplication: (applicationId: string, manifestURL: string) => any,
  onExit: (action?: string) => void,
}

export interface AppStoreMyCustomAppsComponentState {
  isRequestError: boolean,
}

type AppStoreMyCustomAppsProps = AppStoreMyCustomAppsComponentProps
  & WithCustomApplicationsProps
  & WithCustomAppRequestModeStatus
  & WithAppModalStatusProps
  & MutateSetSearchStringProps
  & MutateSetCustomAppRequestModeProps
  & MutateSetSelectedCustomAppProps
  & MutateSetAppModalStatusProps
  & MutateDeleteApplicationProps;

type Props = WithApolloClient<AppStoreMyCustomAppsProps>;

@injectSheet(styles)
class AppStoreMyCustomApps extends React.PureComponent<Props, AppStoreMyCustomAppsComponentState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isRequestError: false,
    };
  }
  componentDidMount() {
    scrollToTop();
  }

  exitFlow = (isShouldRefetchCustomApps: boolean, appName?: string) => {
    this.props.mutateSetAppModalStatus({
      variables: {
        isAppModalOpen: false,
      },
    });

    this.setState({ isRequestError: false });

    this.props.mutateSetSearchString({
      variables: {
        searchString: '',
        searchStringAfterEnterPress: '',
        isEnterPressed: false,
      },
    });

    this.props.mutateSetSelectedCustomApp({
      variables: {
        app: initialState.selectedCustomApp.app,
      },
    });

    this.props.mutateSetCustomAppRequestMode({
      variables: {
        appRequestIsOpen: false,
        currentMode: '',
      },
    });

    scrollToTop();
  }

  updateCache = (entityName: string) => {
    return (cache: any) => {
      Object.keys(cache.data.data).forEach((key) => {
        key.match(`^${entityName}$`) && cache.data.delete(key);
      });
      this.props.client.reFetchObservableQueries();
    };
  }

  deleteApplication = (app: Application) => {
    window.bx.applications.uninstallByManifest(app.bxAppManifestURL).then(() => {
      this.exitFlow(false);
      location.reload();
    }).catch((e) => {
      console.error(e);
      this.setState({ isRequestError: true });
    });
  }

  render() {
    const {
      classes,
      privateApps,
      appRequestIsOpen,
      currentMode,
      loading,
      onAddApplication,
    } = this.props;
    const title = 'My custom apps';
    const subTitle = 'URLs you added to your Store';
    const renderPrivateApps = (privateApps && !!privateApps.length && !loading) || !!(privateApps && !privateApps.length && loading);

    return (
      <React.Fragment>
        {loading ?
          <AppStorePreloader isAnimationStopped={!loading}/>
          :
          <React.Fragment>
            <section className={classes!.section}>
              {(renderPrivateApps || appRequestIsOpen) &&
                <AppStorePageHeader
                  title={title}
                  subTitle={subTitle}
                >
                  {!appRequestIsOpen && <AppRequestButton btnSize={Size.SMALL}/>}
                </AppStorePageHeader>
              }

              {appRequestIsOpen ?
                <div className={classes!.container}>
                  <div className={classes!.goBackBtn} onClick={() => this.exitFlow(false)}>My custom apps</div>
                  {
                    <React.Fragment>
                      {currentMode === customAppsMode.editMode ?
                        <AppRequestModal
                          closeModal={this.exitFlow}
                          isRequestError={this.state.isRequestError}
                        >
                          <AppDeleteModalBody
                            deleteApplication={this.deleteApplication}
                            closeModal={this.exitFlow}
                          />
                        </AppRequestModal>
                        :
                        <AppRequest
                          currentSearch={this.props.currentSearch}
                          onAddApplication={onAddApplication}
                          exitFlow={this.exitFlow}
                        />
                      }
                    </React.Fragment>
                  }
                </div>
                :
                <AppStoreMyCustomAppsList
                  privateApps={privateApps}
                  renderPrivateApps={renderPrivateApps}
                  onAddApplication={onAddApplication}
                  appStoreContext={this.props.appStoreContext}
                />
              }
            </section>
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

export default compose(
  withApollo,
  withCustomApplications,
  withCustomAppRequestMode,
  withAppModal,
  graphql(SET_SEARCH_STRING, { name: 'mutateSetSearchString' }),
  graphql(SET_CUSTOM_APP_REQUEST_MODE, { name: 'mutateSetCustomAppRequestMode' }),
  graphql(SET_SELECTED_CUSTOM_APP, { name: 'mutateSetSelectedCustomApp' }),
  graphql(SET_APP_MODAL_STATUS, { name: 'mutateSetAppModalStatus' }),
  graphql(DELETE_APPLICATION, { name: 'mutateDeleteApplication' }),
)(AppStoreMyCustomApps);
