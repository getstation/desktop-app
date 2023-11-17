import { updateUI } from 'redux-ui/transpiled/action-reducer';
import classNames from 'classnames';
import memoize from 'memoizee';
import * as remote from '@electron/remote';
import mod from 'mod-op';
import PropTypes from 'prop-types';
import { findIndex, prop, propEq, tail } from 'ramda';
import React from 'react';
import { findDOMNode } from 'react-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { compose } from 'react-apollo';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';

import { withGetActivity } from '../activity/queries@local.gql.generated';
import { getKeyAboveTab } from '../app/selectors';
import { openProcessManager } from '../app/duck';
import AppStore from '../app-store/AppStore';
import * as appActions from '../applications/ApplicationsActions';
import { executeWebviewMethodForCurrentTab } from '../tab-webcontents/duck';
import { getSearchValue } from '../bang/selectors';
import { cyclingStep as bangCyclingStep, selectItem as selectBangItem, setVisibility } from '../bang/duck';
import {
  getApplicationBadge,
  getApplicationIconURL,
  getApplicationId,
  getApplicationManifestURL,
} from '../applications/get';
import { getForeFrontNavigationStateProperty } from '../applications/utils';
import AutoUpdateDockNotification from '../auto-update/AutoUpdateDockNotification';
import { getActiveApplicationId } from '../nav/selectors';
import FocusModeDockContainer from '../notification-center/FocusModeDockContainer';
import NotificationCenter from '../notification-center/NotificationCenter';
import { getLinks } from '../password-managers/selectors';
import { setSubdockApplication } from '../subdock/duck';
import { getSubdockApplicationId } from '../subdock/selectors';
import {
  getUILeftDockApplicationTabAdded,
  getUIRecentSubdockHighlightedItemId,
  getUIRecentSubdockIsVisible,
  getUISettingsIsVisible,
} from '../ui/selectors';
import DockItem from './components/DockItem';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import DockIconDragLayer from './DockIconDragLayer';
import * as dockActions from './duck';
import { getApplicationsForDock } from './selectors';
import { isDarwin } from '../utils/process';
import DockWrapper from './components/DockWrapper';
import DockTopSection from './components/DockTopSection';
import { getIsApplicationInstanceLogoInDock } from '../application-settings/selectors';
import { logger } from '../api/logger';
import { changeSelectedApp } from '../applications/duck';
import { OnApplicationInstalled } from './OnApplicationInstalled';

const styles = () => ({
  bottomSection: {
    padding: '2px 0',
    backgroundColor: 'rgba(255,255,255,0.2)'
  }
});

const onTrafficLightClose = () => remote.getCurrentWindow().close();

@injectSheet(styles)
class DockImpl extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    applications: ImmutablePropTypes.list.isRequired,
    activeApplicationId: PropTypes.string,
    subdockApplicationId: PropTypes.string,
    changeSelectedApp: PropTypes.func.isRequired,
    changeTabPositionIndex: PropTypes.func.isRequired,
    onOverStateChange: PropTypes.func.isRequired,
    passwordManagerLinks: PropTypes.object.isRequired,
    applicationsTabAdded: PropTypes.object,
    showPaneViaCtrlTab: PropTypes.func.isRequired,
    hidePaneViaCtrlTab: PropTypes.func.isRequired,
    showPaneViaHover: PropTypes.func.isRequired,
    hidePaneVia: PropTypes.func.isRequired,
    hidePaneViaEsc: PropTypes.func.isRequired,
    highlightedItemId: PropTypes.string,
    recentItems: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectItem: PropTypes.func.isRequired,
    cyclingStep: PropTypes.func.isRequired,
    focusWebview: PropTypes.func.isRequired,
    blurWebview: PropTypes.func.isRequired,
    bangSearchValue: PropTypes.string.isRequired,
    keyAboveTab: PropTypes.string.isRequired,
    isSettingsVisible: PropTypes.bool.isRequired,
    openProcessManager: PropTypes.func.isRequired,
    closeSettings: PropTypes.func.isRequired,
    getIsInstanceLogoInDock: PropTypes.func.isRequired,
    setHighlightedRecentSubdockItemId: PropTypes.func.isRequired,
    showRecentSubdock: PropTypes.func.isRequired,
    hideRecentSubdock: PropTypes.func.isRequired,
  };

  static defaultProps = {
    activeApplicationId: '',
    subdockApplicationId: null,
    applicationsTabAdded: undefined,
    highlightedItemId: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      overIcon: false,
      overSubDock: false,
      applicationId: null,
      activeCyclingTabId: null,
      activeCyclingApplicationId: null,
      recentlyInstalledApplicationIds: [],
      iconRefs: {},
      isDraggingIcon: false
    };
    this.timeoutIcon = null;
    this.timeoutSubdock = null;
    this.isBangMounted = false;
    this.shouldScrollToHighlightedItemComponent = false;
    this.handleCtrlTabShortCuts = this.handleCtrlTabShortCuts.bind(this);
    this.handleCtrlTabCyclingStart = this.handleCtrlTabCyclingStart.bind(this);
    this.handleCtrlTabCyclingStep = this.handleCtrlTabCyclingStep.bind(this);
    this.handleCtrlTabCyclingEnd = this.handleCtrlTabCyclingEnd.bind(this);
    this.handleCtrlAltArrow = this.handleCtrlAltArrow.bind(this);
    this.handleCtrlAltArrowEnd = this.handleCtrlAltArrowEnd.bind(this);
    this.handleCtrlNum = this.handleCtrlNum.bind(this);

    this.onIconOverStateChange = this.onIconOverStateChange.bind(this);
    this.onClickOutsideSubdock = this.onClickOutsideSubdock.bind(this);
    this.onSubdockOverStateChange = this.onSubdockOverStateChange.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { activeCyclingTabId } = this.state;
    const highlightedItemIdChanged = this.props.highlightedItemId !== nextProps.highlightedItemId;
    const activeCyclingTabIdNotChanged = activeCyclingTabId && activeCyclingTabId !== nextProps.highlightedItemId;
    if (highlightedItemIdChanged && activeCyclingTabIdNotChanged) {
      this.setState({ activeCyclingTabId: nextProps.highlightedItemId });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.applicationId && (this.isSubdockOpen(this.state) !== this.isSubdockOpen(prevState)
      || prevState.applicationId !== this.state.applicationId)) {
      this.props.onOverStateChange(this.state.applicationId);
    }

    if (this.props.activeApplicationId !== undefined &&
      prevProps.activeApplicationId !== this.props.activeApplicationId) {
      this.shouldScrollToHighlightedItemComponent = true;
    }

    // clean the `iconRefs` when an application is removed
    if (prevProps.applications !== this.props.applications) {
      const removedApplications = prevProps.applications.filter(
        app => !this.props.applications.find(app2 => app.get('applicationId') === app2.get('applicationId'))
      );
      this.setState(({ iconRefs }) => {
        removedApplications.forEach(app => {
          delete iconRefs[app.get('applicationId')];
        });
        return { iconRefs: { ...iconRefs } };
      });
    }
  }

  onIconRef = memoize((applicationId, isActive) => el => {
    if (isActive && el) {
      this.scrollToHighlightedItemComponent(el);
    }

    // keep a map of the refs by `applicationId`
    this.setState({
      iconRefs: {
        ...this.state.iconRefs,
        [applicationId]: el,
      },
    });
  })

  scrollToHighlightedItemComponent = (el) => {
    if (this.shouldScrollToHighlightedItemComponent) {
      const item = findDOMNode(el);
      if (item) {
        // Since C73, the traditional `DOMElement.scrollIntoView()`
        // **seemed** to trigger a scroll even if the element is already
        // visible.
        // Using the `DOMElement.scrollIntoViewIfNeeded()` seemed to
        // avoid that, but there is no 'smooth' option
        // That's why we're using the ponyfill `smooth-scroll-into-view-if-needed`
        scrollIntoViewIfNeeded(item, {
          behavior: 'smooth',
          scrollMode: 'if-needed',
          block: 'nearest',
          inline: 'nearest',
        });
        this.shouldScrollToHighlightedItemComponent = false;
      }
    }
  }

  stopCycling = () => {
    if (this.state.activeCyclingTabId) {
      this.setState({ activeCyclingTabId: null });
    }
  };

  onIconOverStateChange = memoize(applicationId => isOver => {
    clearTimeout(this.timeoutIcon);
    if (!isOver) {
      this.timeoutIcon = setTimeout(() => {
        this.setState({ overIcon: false });
      }, 150);
    }
  })

  onDraggingStateChange = (isDragging) => {
    this.setState({ isDraggingIcon: isDragging });
  }

  onSubdockOverStateChange(isOver) {
    clearTimeout(this.timeoutSubdock);
    if (isOver) {
      this.setState({ overSubDock: true });
    } else {
      this.timeoutSubdock = setTimeout(() => {
        this.setState({ overSubDock: false });
      }, 200);
    }
  }

  /**
   * Called when we are notified via GraphQL Subscription
   * that an applications has just been installed.
   *
   *
   * This may happen **before** the corresponding DockIcon is
   * mounted. That's why the triggering of the animation and of
   * the scroll is implemented at `<Dock />` level and not at
   * `<DockIcon />` level.
   */
  onApplicationInstalled = (applicationId) => {
    // adding the application to `recentlyInstalledApplicationIds` will trigger
    // the addition of `dramaticEnter` props on `DockIcon`
    this.setState(({ recentlyInstalledApplicationIds }) => ({
      recentlyInstalledApplicationIds: recentlyInstalledApplicationIds.concat(applicationId)
    }));

    // let's scroll to the installed application
    // we let a 50ms delay for the UI to have mounted
    // the application
    setTimeout(() => {
      const node = findDOMNode(this.state.iconRefs[applicationId]);
      if (!node) return;
      scrollIntoViewIfNeeded(node, {
        behavior: 'smooth',
        scrollMode: 'if-needed',
        block: 'nearest',
        inline: 'nearest',
      });
    }, 50);
  }

  onClickOutsideSubdock = () => {
    this.handleHideSubdock();
  };

  getSelectedApplicationId() {
    return this.state.activeCyclingApplicationId || this.props.activeApplicationId;
  }

  getNextCyclingApplicationId(applicationId, reverse) {
    const { applications } = this.props;
    const appIds = applications.map(getApplicationId);
    const activeCyclingAppIndex = appIds.indexOf(applicationId);
    const nextActiveCyclingAppIndex = reverse ?
      mod(activeCyclingAppIndex - 1, appIds.size) :
      mod(activeCyclingAppIndex + 1, appIds.size);

    return appIds.get(nextActiveCyclingAppIndex);
  }

  getNextCyclingTabIndex(tabId, reverse) {
    const { recentItems } = this.props;
    const currentIndex = this.getCurrentCyclingTabIndex(tabId);

    if (reverse && currentIndex === -1) {
      return recentItems.length - 1;
    } else if (!reverse && currentIndex === -1) {
      return 0;
    }

    return reverse ?
      mod(currentIndex - 1, recentItems.length) :
      mod(currentIndex + 1, recentItems.length);
  }

  getCurrentCyclingTabIndex(tabId) {
    const { recentItems } = this.props;
    return findIndex(propEq('resourceId', tabId), recentItems);
  }

  isSubdockOpen = (state) => state.overIcon || state.overSubDock;

  isSubdockOpenForApplication(applicationId) {
    // we don't want to show the subdock if we are dragging the subdock
    if (this.state.isDraggingIcon) return false;

    return this.isSubdockOpen(this.state) &&
      (this.state.applicationId === applicationId
        || this.props.subdockApplicationId === applicationId);
  }

  handleCtrlAltArrow(reverse) {
    const selectedApplicationId = this.getSelectedApplicationId();
    const nextCyclingApplicationId = this.getNextCyclingApplicationId(selectedApplicationId, reverse);
    this.setState({ activeCyclingApplicationId: nextCyclingApplicationId });
  }

  handleCtrlAltArrowEnd() {
    const selectedApplicationId = this.getSelectedApplicationId();
    this.props.changeSelectedApp(selectedApplicationId, 'keyboard_shortcut_ctrl_alt_arrow');
    this.setState({ activeCyclingApplicationId: null });
  }

  handleCtrlTabShortCuts() {
    const {
      recentItems,
      highlightedItemId,
      bangSearchValue,
    } = this.props;

    if (this.isBangMounted) {
      const nextActiveCyclingTabIndex = this.getNextCyclingTabIndex(highlightedItemId, false);
      const selectedTab = recentItems[nextActiveCyclingTabIndex];
      this.props.selectItem(selectedTab, nextActiveCyclingTabIndex, 'quick-ctrl-tab', 'subdock', bangSearchValue);
    } else {
      const firstItem = prop(0, recentItems);
      if (!firstItem) {
        return;
      }

      this.props.selectItem(firstItem, 1, 'quick-ctrl-tab', 'subdock', '');
    }
  }

  handleCtrlTabCyclingStart() {
    this.setState({ activeCyclingTabId: this.props.highlightedItemId });
  }

  handleCtrlTabCyclingStep(cyclingCount, reverse) {
    const { activeCyclingTabId } = this.state;
    const { recentItems } = this.props;
    const nextActiveCyclingTabIndex = this.getNextCyclingTabIndex(activeCyclingTabId, reverse);
    const selectedTab = recentItems[nextActiveCyclingTabIndex];
    const direction = reverse ? 'up' : 'down';

    if (!this.isBangMounted) {
      this.props.showPaneViaCtrlTab();
      this.props.cyclingStep(selectedTab, nextActiveCyclingTabIndex, direction, 'subdock');
    } else {
      this.props.cyclingStep(selectedTab, nextActiveCyclingTabIndex, direction, 'subdock', 'tab-on-held-ctrl');
    }

    this.setState({ activeCyclingTabId: selectedTab.resourceId });
  }

  handleCtrlTabCyclingEnd() {
    const { recentItems } = this.props;
    const { activeCyclingTabId } = this.state;
    if (!activeCyclingTabId) return;

    this.props.hideRecentSubdock();
    this.props.hidePaneViaCtrlTab();

    const selectedTabIndex = this.getCurrentCyclingTabIndex(activeCyclingTabId);
    if (selectedTabIndex === -1) {
      logger.notify(new Error(`Cycling ERROR: index cannot be found for tabId '${activeCyclingTabId}'`));
      return;
    }
    const selectedTab = recentItems[selectedTabIndex];

    this.props.selectItem(selectedTab, selectedTabIndex, 'release-held-ctrl', 'subdock', '');
    this.stopCycling();
  }

  handleBangEscape = (format) => {
    this.stopCycling();
    this.props.hidePaneViaEsc(format);
  };

  handleBangWillUnmount = () => {
    this.isBangMounted = false;
    this.props.setHighlightedRecentSubdockItemId();
    this.stopCycling();
    this.props.focusWebview();
  };

  handleBangDidMount = () => {
    this.isBangMounted = true;
    this.props.blurWebview();
  };

  handleCtrlNum(index) {
    const { applications } = this.props;
    const appIds = applications.map(app => getApplicationId(app));
    if (appIds.has(index - 1)) {
      this.props.changeSelectedApp(appIds.get(index - 1), 'keyboard_shortcut_ctrl_num');
    }
  }

  handleMoveIcon = (applicationId, index) => {
    const { changeTabPositionIndex } = this.props;
    changeTabPositionIndex(applicationId, index);
  };

  handleClickDockItem = memoize(applicationId => () => {
    const selectedApp = this.getSelectedApplicationId();
    if (selectedApp === applicationId) {
      this.setState({ overIcon: true, applicationId });
    } else {
      this.props.changeSelectedApp(applicationId, 'mouse_click');
      this.handleHideSubdock();
    }
  });

  handleRightClickDockItem = memoize(applicationId => () => {
    this.setState({ overIcon: true, applicationId });
  });

  handleClickDock = () => {
    const { isSettingsVisible, closeSettings } = this.props;
    if (isSettingsVisible) {
      closeSettings();
    }
  };

  handleSelectItem = (...args) => {
    this.props.selectItem(...args);
    this.stopCycling();
  }

  handleHideSubdock = () => {
    clearTimeout(this.timeoutIcon);
    clearTimeout(this.timeoutSubdock);
    this.setState({ overSubDock: false, overIcon: false });
  }

  handleShowRecentSubdock = () => {
    if (!this.isBangMounted) {
      this.props.showRecentSubdock();
      this.props.showPaneViaHover();
    }
  }

  handleHideRecentSubdock = (via) => {
    if (this.isBangMounted) {
      this.props.hideRecentSubdock();
      this.props.hidePaneVia(via);
    }
  }

  render() {
    const {
      applications, classes, applicationsTabAdded, passwordManagerLinks,
      recentItems, highlightedItemId, setHighlightedRecentSubdockItemId,
      isRecentSubdockVisible, cyclingStep,
    } = this.props;

    return (
      <DockWrapper onClickDock={this.handleClickDock}>
        <DockTopSection
          isDarwin={isDarwin}
          onClose={onTrafficLightClose}
          isRecentSubdockVisible={isRecentSubdockVisible}
          showRecentSubdock={this.handleShowRecentSubdock}
          hideRecentSubdock={this.handleHideRecentSubdock}
          handleRecentDockDidMount={this.handleBangDidMount}
          handleRecentDockWillUnmount={this.handleBangWillUnmount}
          setHighlightedRecentSubdockItemId={setHighlightedRecentSubdockItemId}
          highlightedRecentSubdockItemId={highlightedItemId}
          cyclingStep={cyclingStep}
          ctrlTabCycling={Boolean(this.state.activeCyclingTabId)}
          handlePaneEscape={this.handleBangEscape}
          stopCycling={this.stopCycling}
          recentApplications={recentItems}
          selectItem={this.handleSelectItem}
        />

        <div className={classNames('l-dock__scroll', 'appcues-dock')}>
          {
            applications.entrySeq().map(([index, application]) => {
              const manifestURL = getApplicationManifestURL(application);
              const applicationId = getApplicationId(application);
              const passwordManagerLink = passwordManagerLinks.get(applicationId);
              const passwordManagerLinkLogo = passwordManagerLink ? passwordManagerLink.get('avatar') : '';
              const tabAdded = applicationsTabAdded ? (applicationsTabAdded.get(applicationId) || false) : false;
              const logoURL = getApplicationIconURL(application) || passwordManagerLinkLogo;
              const isInstanceLogoInDockIcon = this.props.getIsInstanceLogoInDock(manifestURL) && logoURL;
              const isActive = !tabAdded && applicationId === this.getSelectedApplicationId();

              return (
                <DockItem
                  key={applicationId}
                  applicationId={applicationId}
                  active={isActive}
                  badge={getApplicationBadge(application)}
                  isInstanceLogoInDockIcon={isInstanceLogoInDockIcon}
                  logoURL={logoURL}
                  onOverStateChange={this.onIconOverStateChange(applicationId)}
                  onClick={this.handleClickDockItem(applicationId)}
                  onRightClick={this.handleRightClickDockItem(applicationId)}
                  index={index}
                  moveIcon={this.handleMoveIcon}
                  showSubdock={this.isSubdockOpenForApplication(applicationId)}
                  manifestURL={manifestURL}
                  onClickOutsideSubdock={this.onClickOutsideSubdock}
                  onSubdockOverStateChange={this.onSubdockOverStateChange}
                  handleHideSubdock={this.handleHideSubdock}
                  iconRef={this.onIconRef(applicationId, isActive)}
                  dramaticEnter={this.state.recentlyInstalledApplicationIds.includes(applicationId)}
                />
              );
            })
          }
          <DockIconDragLayer onDraggingStateChange={this.onDraggingStateChange} />
        </div>

        <div className={classes.bottomSection}>
          <AutoUpdateDockNotification />
          <AppStore />
          <FocusModeDockContainer />
          <NotificationCenter />
        </div>

        <KeyboardShortcuts
          keyAboveTab={this.props.keyAboveTab}
          onCtrlTab={this.handleCtrlTabShortCuts}
          onCtrlTabCyclingStart={this.handleCtrlTabCyclingStart}
          onCtrlTabCyclingStep={this.handleCtrlTabCyclingStep}
          onCtrlTabCyclingEnd={this.handleCtrlTabCyclingEnd}
          onCtrlAltArrow={this.handleCtrlAltArrow}
          onCtrlAltArrowEnd={this.handleCtrlAltArrowEnd}
          onCtrlNum={this.handleCtrlNum}
        />
        <OnApplicationInstalled
          callback={this.onApplicationInstalled}
        />
      </DockWrapper>
    );
  }
}

const Dock = compose(
  withGetActivity({
    props: ({ data }) => ({
      recentItems: data && data.activity ? tail(data.activity) : []
    })
  }),
  connect(
    (state) => ({
      applications: getApplicationsForDock(state),
      activeApplicationId: getActiveApplicationId(state),
      highlightedItemId: getUIRecentSubdockHighlightedItemId(state),
      isRecentSubdockVisible: getUIRecentSubdockIsVisible(state),
      bangSearchValue: getSearchValue(state),
      subdockApplicationId: getSubdockApplicationId(state),
      isLoading: getForeFrontNavigationStateProperty(state, 'isLoading'),
      canGoBack: getForeFrontNavigationStateProperty(state, 'canGoBack'),
      canGoForward: getForeFrontNavigationStateProperty(state, 'canGoForward'),
      passwordManagerLinks: getLinks(state),
      applicationsTabAdded: getUILeftDockApplicationTabAdded(state),
      keyAboveTab: getKeyAboveTab(state),
      isSettingsVisible: getUISettingsIsVisible(state),
      getIsInstanceLogoInDock: (manifestURL) => getIsApplicationInstanceLogoInDock(state, manifestURL),
    }),
    (dispatch) => bindActionCreators({
      changeSelectedApp,
      ...appActions,
      changeTabPositionIndex: dockActions.changeAppItemPosition,
      onOverStateChange: (applicationId) => setSubdockApplication(applicationId),
      showRecentSubdock: () => updateUI('recentSubdock', 'isVisible', true),
      hideRecentSubdock: () => updateUI('recentSubdock', 'isVisible', false),
      showPaneViaCtrlTab: () => setVisibility('subdock', true, 'held-ctrl-tab'),
      hidePaneViaCtrlTab: () => setVisibility('subdock', false, 'release-held-ctrl'),
      showPaneViaHover: () => setVisibility('subdock', true, 'recent-dock-icon-hover'),
      hidePaneVia: (via) => setVisibility('subdock', false, via),
      hidePaneViaEsc: (format) => setVisibility(format, false, 'keyboard-esc'),
      selectItem: selectBangItem,
      cyclingStep: bangCyclingStep,
      focusWebview: () => executeWebviewMethodForCurrentTab('focus'),
      blurWebview: () => executeWebviewMethodForCurrentTab('blur'),
      openProcessManager: () => openProcessManager(),
      closeSettings: () => updateUI('settings', 'isVisible', false),
      setHighlightedRecentSubdockItemId: (id) => updateUI('recentSubdock', 'highlightedItemId', id),
    }, dispatch)
  ),
)(DockImpl);

export default Dock;
