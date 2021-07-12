import { GradientType, withGradient } from '@getstation/theme';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { oc } from 'ts-optchain';
import { pure } from 'recompose';
import Maybe from 'graphql/tsutils/Maybe';

import { createNewEmptyTab, installApplication, navigateToApplicationTabAutomatically, toggleNotifications } from '../applications/duck';
import { getApplicationActiveTab } from '../applications/get';
import { getTabById } from '../tabs/selectors';
import { getTabURL } from '../tabs/get';
import { getApplicationById as getApplicationByIdSelector, getNotificationsEnabled } from '../applications/selectors';
import { addTabAsFavorite, openFavorite, removeFavorite } from '../favorites/duck';
import { openApplicationPreferences, OpenApplicationPreferencesVia } from '../settings/applications/duck';
import { attach, detach } from '../subwindows/duck';
import { closeTab } from '../tabs/duck';
import { StationState } from '../types';
import { requestSignInThenAddApplication } from '../user-identities/duck';

import Subdock from './components/Subdock';
import { Application } from './types';
import { withGetApplicationForSubdock } from './queries@local.gql.generated';

export interface ITabSelectedInfo {
  isHome: boolean,
  isFavorite: boolean,
}

export interface ActiveTab {
  id: Maybe<string>,
  url: Maybe<string>,
}

interface GraphQLProps {
  loading: boolean,
  application: Application,
}

export interface OuterProps {
  applicationId: string,
  onOverStateChange: (change: boolean) => void,
  handleHideSubdock: () => void,
  onLoaded?: () => void, // used to inform parent component when subdock is fully loaded,
}

export interface OwnProps {
  activeTab: ActiveTab,
  notificationsEnabled: boolean | undefined,
  themeGradient: string,
  onSelectTab: (tabId: string) => any,
  onDetachTab: () => any,
  onAttachTab: () => any,
  onSelectFavorite: (favoriteId: string) => void,
  onAddTabAsFavorite: () => any,
  onRemoveFavorite: (favoriteId: string, tabId: string) => any,
  onDetachFavorite: () => any,
  onCloseTab: (tabId: string) => void,
  onClickAddNewInstance: (application: Application, identityNeeded?: boolean) => void,
  toggleNotifications: () => void,
  openApplicationPreferences: (application: Application) => void,
  onOpenNewTab: () => void,
}

type Props = OuterProps & OwnProps & GraphQLProps;

class SubdockContainerImpl extends React.PureComponent<Props, {}> {
  constructor(args: Props) {
    super(args);

    this.onSelectFavorite = this.onSelectFavorite.bind(this);
    this.onSelectTab = this.onSelectTab.bind(this);
    this.onCloseTab = this.onCloseTab.bind(this);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.loading && !this.props.loading) {
      this.props.onLoaded && this.props.onLoaded();
    }
  }

  onSelectFavorite(favoriteId: string) {
    const { onSelectFavorite } = this.props;

    onSelectFavorite(favoriteId);
  }

  onSelectTab(tabId: string) {
    const { onSelectTab, handleHideSubdock } = this.props;

    onSelectTab(tabId);
    handleHideSubdock();
  }

  onCloseTab(tabId: string) {
    const { onCloseTab } = this.props;

    onCloseTab(tabId);
  }

  render() {
    const { loading } = this.props;
    if (loading) return null;

    return (
      <Subdock
        {...this.props}
        onSelectFavorite={this.onSelectFavorite}
        onSelectTab={this.onSelectTab}
        onCloseTab={this.onCloseTab}
      />
    );
  }
}

const SubdockContainer = compose(
  pure,
  connect(
    (state: StationState, ownProps: Props) => {
      const { applicationId } = ownProps;
      const application = getApplicationByIdSelector(state, applicationId);

      // By default, its elements are null, but fill them if it exists
      let activeTab: ActiveTab = { id: null, url: null };
      if (application) {
        const activeTabId = getApplicationActiveTab(application);
        const tab = getTabById(state, activeTabId);
        if (tab) activeTab = { id: activeTabId, url: getTabURL(tab) };
      }

      return {
        activeTab: activeTab,
        notificationCount: 0,
        notificationsEnabled: getNotificationsEnabled(state, applicationId),
      };
    },
    (dispatch, ownProps) => {
      return bindActionCreators({
        onSelectTab: tabId => navigateToApplicationTabAutomatically(tabId, 'mouse_click'),
        onCloseTab: tabId => closeTab(tabId),
        onDetachTab: tabId => detach(tabId),
        onAttachTab: tabId => attach(tabId),
        onSelectFavorite: favoriteId => openFavorite(favoriteId),
        onRemoveFavorite: (favoriteId, tabId) => removeFavorite(favoriteId, tabId),
        onAddTabAsFavorite: tabId => addTabAsFavorite(tabId),
        onDetachFavorite: favoriteId => openFavorite(favoriteId, true),
        toggleNotifications: () => toggleNotifications(ownProps.applicationId),
        openApplicationPreferences: (application: Application) =>
          openApplicationPreferences(application.manifestURL, OpenApplicationPreferencesVia.APP_SUBDOCK),
        onOpenNewTab: () => createNewEmptyTab(ownProps.applicationId, false),
        onClickAddNewInstance: (application: Application, identityNeeded?: boolean) => {
          if (identityNeeded) {
            return requestSignInThenAddApplication('google', undefined, application.manifestURL, 'subdock');
          }
          return installApplication(application.manifestURL, { navigate: true });
        },
      }, dispatch);
    }
  ),
  withGetApplicationForSubdock<OuterProps, Partial<Props>>({
    options: (props) => ({ variables: { applicationId: props.applicationId } }),
    props: ({ data }) => ({
      loading: !data || data.loading,
      application: oc(data).application(),
    }),
  }),
  withGradient(GradientType.withDarkOverlay),
)(SubdockContainerImpl);

export default SubdockContainer as React.ComponentType<OuterProps>;
