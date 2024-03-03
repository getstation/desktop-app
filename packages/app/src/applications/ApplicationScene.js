import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import TabSearchInput from '../in-tab-search/TabSearchInput';
import { getActiveApplicationId } from '../nav/selectors';
import AskAuthorizeNotificationsApplication from '../notifications/AskAuthorizeNotificationsApplication/container';
import PasswordManager from '../password-managers/PasswordManager';
import { isWebcontentsDetaching, isWebcontentsMounted } from '../tab-webcontents/selectors';
import { getTabApplicationId, getTabId, getTabLoadTab } from '../tabs/get';
import Application from './Application';
import { getApplicationActiveTab, getApplicationId, getInstallContext } from './get';
import PureClassTabContent from './PureClassTabContent';
import { getApplications, getTabsAsList } from './selectors';
import ConfirmResetApplication from './components/ConfirmResetApplication';

const mapStateToProps = (state) => ({
  applications: getApplications(state),
  tabs: getTabsAsList(state),
  activeApplicationId: getActiveApplicationId(state),
});

const getOrderKey = (tab) => `${getTabApplicationId(tab)}/${getTabId(tab)}`;

// TODO remove the connect with redux or move to containers
@connect(mapStateToProps)
class ApplicationScene extends React.PureComponent {
  static propTypes = {
    applications: ImmutablePropTypes.map.isRequired,
    activeApplicationId: PropTypes.string,
    tabs: ImmutablePropTypes.contains({
      title: PropTypes.string,
      tabId: PropTypes.string,
      url: PropTypes.string,
      isApplicationHome: PropTypes.bool,
      loadTab: PropTypes.bool
    }).isRequired,
  };

  renderApplicationTab = (tab) => {
    const { applications, activeApplicationId } = this.props;
    const tabId = getTabId(tab);
    const applicationId = getApplicationId(tab);
    const application = applications.get(applicationId);
    const activeTab = getApplicationActiveTab(application);
    const isAppActive = applicationId === activeApplicationId;
    const isTabActive = isAppActive && activeTab === tabId;
    const isDetaching = isWebcontentsDetaching(tab);
    const isMounted = isWebcontentsMounted(tab);
    const isInSubwindow = tab.get('isInSubwindow');
    // While detaching, we must keep the Application mounted in order to be able to
    // use guestinstance of underlying webview.
    const loadTab = getTabLoadTab(tab) &&
      ((isInSubwindow && isDetaching) || !isInSubwindow);

    return (
      <PureClassTabContent
        key={`${applicationId}/${tabId}`}
        isVisible={isTabActive}
      >
        {loadTab &&
          <Application
            hidden={isMounted && !isTabActive}
            application={application}
            tab={tab}
          />
        }
        <TabSearchInput tabId={tabId} />
      </PureClassTabContent>
    );
  }

  renderTabs() {
    const { tabs } = this.props;

    return tabs
      .valueSeq()
      // We need to sort all tabs to ensure that
      // they will never be moved in the DOM after being inserted.
      // This avoids webview from being disconnected, which would destroy the underlying webContents.
      .sort((tabA, tabB) => getOrderKey(tabA).localeCompare(getOrderKey(tabB)))
      .map(this.renderApplicationTab);
  }

  render() {
    const { activeApplicationId, applications } = this.props;
    const activeApplication = applications.get(activeApplicationId);
    const activeApplicationInstallContext = activeApplication ? getInstallContext(activeApplication) : undefined;

    return (
      <div className={classNames('l-webview')}>
        {/* TODO: Migrate to JSS */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          {/* PasswordManager component does not work if no `activeApplicationId` */}
          {activeApplicationId &&
            <React.Fragment>
              <PasswordManager />
              <ConfirmResetApplication applicationId={activeApplicationId} />
            </React.Fragment>
          }

          <AskAuthorizeNotificationsApplication />

          <div className={classNames('l-webview__wrap')}>
            {this.renderTabs()}
          </div>

          <div className="l-webview__no-app">
            <span>
              Looks like you {'haven\'t'} add any apps for now.
              <br />
              Visit the <a>App Store</a> to install your first one.
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default ApplicationScene;
