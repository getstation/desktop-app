/*
  We forked the Slack library for @getstation/slack since we need to use
  the browser version (the worker is a renderer process) and we are in a node context.
*/
import * as slack from 'slack';
import { GradientType, withGradient } from '@getstation/theme';
import ElectronWebview from 'app/common/components/ElectronWebview';
import * as classNames from 'classnames';
import { clipboard } from 'electron';
import * as remote from '@electron/remote';
// @ts-ignore no declaration file
import { fetchFavicon, setFetchFaviconTimeout } from '@getstation/fetch-favicon';
import Maybe from 'graphql/tsutils/Maybe';
// @ts-ignore
import * as isBlank from 'is-blank';
// @ts-ignore
import * as throttle from 'lodash.throttle';
import * as path from 'path';
import { noop, compact } from 'ramda-adjunct';
import * as React from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// @ts-ignore no declaration file
import { updateUI } from 'redux-ui/transpiled/action-reducer';
import { filter, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { oc } from 'ts-optchain';
import { format as formatUrl } from 'url';
import { injectJS } from '../plugins/helpers';
import { getFavicon, getSizedAndOrderedFavicons } from './uiHelpers';
import { ActionsBus, withActionsBus } from '../store/actionsBus';
import {
  attachWebcontentsToTab,
  EXECUTE_WEBVIEW_METHOD,
  ExecuteWebviewMethodAction,
  performBasicAuth as performBasicAuthAction,
  setCrashed,
  setLoadingError,
  setNotCrashed,
} from '../tab-webcontents/duck';
import { getTabWebcontentsById, getWebcontentsAuthInfo, getWebcontentsAuthState } from '../tab-webcontents/selectors';
import { updateLoadingState, updateTabBadge, updateTabFavicons, updateTabTitle, updateTabURL } from '../tabs/duck';
import { getTabId, getTabLoadingState } from '../tabs/get';
import { StationTabImmutable } from '../tabs/types';
import { RecursiveImmutableMap, StationState } from '../types';
import { isPackaged } from '../utils/env';
import ApplicationContainer from './components/ApplicationContainer';
import { navigateToApplicationTab, setConfigData, uninstallApplication, updateApplicationIcon } from './duck';
import LazyWebview from './LazyWebview';
import { withGetApplicationState } from './queries@local.gql.generated';
import { getApplicationDescription } from './selectors';
import { ApplicationImmutable } from './types';
import { getForeFrontNavigationStateProperty } from './utils';

type WebviewMethod = (webview: ElectronWebview) => void;
type WebviewMethods = {
  [k: string]: WebviewMethod,
};

// preload file can only be loaded though file:// URL.
// When using webpack-dev-server, we need to force it.
declare const __webpack_main_path__: string;
const preloadUrl = isPackaged ? './preload.js' : formatUrl({
  pathname: path.join(__webpack_main_path__, 'preload.js'),
  protocol: 'file',
  slashes: true,
});

const toggleDevTools: WebviewMethod = (webview) => {
  if (webview.isDevToolsOpened()) {
    webview.closeDevTools();
  } else {
    webview.openDevTools();
  }
};

const webviewMethods: WebviewMethods = {
  focus: (webview) => webview.focus(),
  blur: (webview) => webview.view.blur(),
  reload: (webview) => webview.isReady() && webview.reload(),
  'go-back': (webview) => webview.isReady() && webview.goBack(),
  'go-forward': (webview) => webview.isReady() && webview.goForward(),
  'toggle-dev-tools': (webview) => webview.isReady() && toggleDevTools(webview),
  'copy-url-to-clipboard': (webview) => webview.isReady() && clipboard.write({
    bookmark: webview.getTitle(),
    text: webview.getURL(),
  }),
  'paste-and-match-style': (webview) => webview.isReady() && webview.pasteAndMatchStyle(),
};

export interface OwnProps {
  application: ApplicationImmutable,
  tab: StationTabImmutable,
  hidden: boolean,

  loading: boolean,
  manifestURL: Maybe<string>,
  applicationId: string,

  applicationName: Maybe<string>,
  applicationIcon: Maybe<string>,
  themeColor: Maybe<string>,
  notUseNativeWindowOpen: Maybe<boolean>,
  useDefaultSession: Maybe<boolean>,

  appFocus: Maybe<number>,
  isOnline: Maybe<boolean>,

  // Improve : move down the chain, only for ApplicationContainer | LazyWebView
  themeGradient: string,

  actionsBus: ActionsBus | null,
  legacyServiceId: Maybe<string>,
}

export interface StateProps {
  errorCode?: number,
  errorDescription?: string,
  crashed: boolean,

  // Improve : move down the chain, only for ApplicationContainer
  email: Maybe<string>,
  promptBasicAuth: boolean,
  basicAuthInfo: RecursiveImmutableMap<Electron.AuthInfo>,
  canGoBack: any,
}

export interface DispatchProps {
  onFaviconUpdated: Function,
  onTitleUpdated: Function,
  onURLUpdated: Function,
  onBadgeUpdated: Function,
  onLoadingStateChanged: Function,
  onLoadingError: Function,
  onNotificationClicked: Function,
  onUpdateApplicationIcon: Function,
  onWebcontentsAttached: Function,
  onWebcontentsCrashed: Function,
  onWebcontentsOk: Function,
  performBasicAuth: (username: string, password: string) => any,
  onChooseAccount: Function,
  onApplicationRemoved: Function,
  updateResetAppModal: Function,
}

export interface ComputedProps {
  askResetApplication: () => void
}

export type Props = OwnProps & StateProps & DispatchProps & ComputedProps;

export type ApplicationImplState = {
  ready: boolean;
};

class ApplicationImpl extends React.PureComponent {
  static defaultProps = {
    basicAuthInfo: undefined,
    errorCode: null,
    errorDescription: null,
    email: null,
    promptBasicAuth: false,
  };

  public props: Props;
  public state: ApplicationImplState;
  private webView: ElectronWebview;
  private busSubscription: Subscription | null = null;

  constructor(props: Props) {
    super(props);

    // throttle tracking Navigate events
    this.handleDidNavigate = throttle(this.handleDidNavigate, 50, { leading: false });

    this.handleDidStartLoading = this.handleDidStartLoading.bind(this);
    this.handleDidStopLoading = this.handleDidStopLoading.bind(this);
    this.handleDidFailLoad = this.handleDidFailLoad.bind(this);
    this.handleDomReady = this.handleDomReady.bind(this);
    this.setWebviewRef = this.setWebviewRef.bind(this);
    this.handleTitleUpdated = this.handleTitleUpdated.bind(this);
    this.handleFaviconUpdated = this.handleFaviconUpdated.bind(this);
    this.handleWebcontentsCrashed = this.handleWebcontentsCrashed.bind(this);
    this.handleRemoveApplication = this.handleRemoveApplication.bind(this);

    this.state = {
      ready: false,
    };
  }

  shouldReloadAfterConnectionLoss() {
    if (!this.props.errorCode) return;

    // see https://cs.chromium.org/chromium/src/net/base/net_error_list.h
    return ([-105, -106, -109, -130].includes(this.props.errorCode));
  }

  // tslint:disable-next-line:function-name
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (getTabId(nextProps.tab) !== getTabId(this.props.tab)) {
      this.detachBus(); // bus will be automatically re-attached in the next render
    }

    if (nextProps.isOnline
      && !this.props.isOnline
      && this.shouldReloadAfterConnectionLoss()
    ) {
      this.props.onLoadingError(null, null);
      if (this.webView && this.webView.isReady()) this.webView.reload();
    }
  }

  componentDidMount() {
    this.attachBus();
  }

  componentWillUnmount(): void {
    this.detachBus();
  }

  attachBus(): void {
    const { actionsBus } = this.props;
    if (!actionsBus) return;

    const tabId = getTabId(this.props.tab);
    const executeWebviewMethodForTab: Observable<ExecuteWebviewMethodAction> = actionsBus
      .pipe(
        filter(action => action.type === EXECUTE_WEBVIEW_METHOD),
        map(action => action as ExecuteWebviewMethodAction),
        filter(action => action.tabId === tabId)
      );

    this.busSubscription = executeWebviewMethodForTab.subscribe(action => {
      this.handleExecuteWebviewMethod(action);
    });
  }

  detachBus() {
    if (this.busSubscription) {
      this.busSubscription.unsubscribe();
      this.busSubscription = null;
    }
  }

  isWebViewReady() {
    return this.webView && this.webView.isReady();
  }

  goBack = () => {
    if (this.isWebViewReady()) this.webView.goBack();
  }

  handleExecuteWebviewMethod(action: ExecuteWebviewMethodAction) {
    const executeWebviewMethod: WebviewMethod = webviewMethods[action.method] || noop;

    if (this.webView) {
      executeWebviewMethod(this.webView);
    }
  }

  handleIPCMessage(e: any) {
    switch (e.channel) {
      case 'page-bxmetas-updated': {
        const metas = e.args[0];
        if ('badge' in metas) this.props.onBadgeUpdated(metas.badge);
        break;
      }

      case 'notification-clicked': {
        this.props.onNotificationClicked();
        break;
      }

      case 'page-click': {
        this.handlePageClick();
        break;
      }

      default:
        break;
    }
  }

  async handleSlackApiTokenUpdate(apiToken: any) {
    const res = await slack.team.info({ token: apiToken });

    if (!res.team) return;
    const { icon } = res.team;
    this.props.onUpdateApplicationIcon(icon.image_34);
  }

  handlePageClick() {
    // ok — <webview/> is not making mouse event (like click) bubble
    // into the host DOM.
    // This is apriori a bug coming from Chromium
    // References:
    // * https://github.com/electron/electron/issues/6563
    // * https://bugs.chromium.org/p/chromium/issues/detail?id=631484
    // * https://bugs.chromium.org/p/chromium/issues/detail?id=736623
    // So we are doing that manually here so that some UI elements can work.
    // (example: make react-click-outside and friends to work)
    if (this.webView && this.webView.view) {
      this.webView.view.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      // some libraries are not only hooking into click events but also `mousedown` and `mouseup`
      this.webView.view.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      this.webView.view.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    }
  }

  handleDidNavigateInPage(e: any) {
    if (e.isMainFrame) {
      this.handleDidNavigate(e);
    }
  }

  handleDidNavigate(e: any) {
    /*
    * Here it's necessessary to update URL because `loadURLOnTabWebcontents` saga does not handle all the cases
    * i.e. window.location mutation, etc...
    */
    this.props.onURLUpdated(e.url);
  }

  handleDidFailLoad(e: any) {
    if (!e.isMainFrame) return;

    // details https://cs.chromium.org/chromium/src/net/base/net_error_list.h
    const { errorCode, errorDescription } = e;
    this.props.onLoadingError(errorCode, errorDescription);
  }

  handleDidStartLoading() {
    this.props.onLoadingStateChanged(true);
    this.props.onLoadingError(null, null);
    this.props.onWebcontentsOk();
  }

  handleDidStopLoading() {
    this.props.onLoadingStateChanged(false);
  }

  async handleDomReady() {
    const js = await injectJS(this.props.legacyServiceId);

    if (js && this.webView && this.webView.view) {
      this.webView.view.executeJavaScript(js);
    }
    this.setState({ ready: true });
  }

  handleRemoveApplication() {
    const { applicationId } = this.props;
    this.props.onApplicationRemoved(applicationId);
  }

  handleTitleUpdated(e: any) {
    this.props.onTitleUpdated(e.title);
  }

  async handleFaviconUpdated(e: any) {
    const tabUrl = this.props.tab.get('url');

    if (tabUrl) {
      // get the best quality favicon
      const favicon = await getFavicon(new URL(tabUrl).origin);

      const electronFavicons: string[] = e.favicons ?? [];
      const favicons: string[] = compact([favicon, ...electronFavicons]);

      // check size for each image
      const orderedSizedFavicons = await getSizedAndOrderedFavicons(favicons);

      this.props.onFaviconUpdated(orderedSizedFavicons.map(f => f.url));
    }
  }

  handleWebcontentsCrashed() {
    this.props.onWebcontentsCrashed();
  }

  setWebviewRef(wv: ElectronWebview) {
    this.webView = wv;
    if (this.webView && this.webView.view) {
      const webview = this.webView.view;

      webview.addEventListener('dom-ready', () => {
        const webContents = remote.webContents.fromId(webview.getWebContentsId());

        webview.addEventListener('did-navigate-in-page', (e: any) => this.handleDidNavigateInPage(e));
        webview.addEventListener('did-navigate', (e: any) => this.handleDidNavigate(e));
        webview.addEventListener('ipc-message', (e: any) => this.handleIPCMessage(e));
        this.props.onWebcontentsAttached(webContents.id);
      });
    }
  }

  render() {
    const tab = this.props.tab;
    const useNativeWindowOpen = !this.props.notUseNativeWindowOpen;
    const tabUrl = tab.get('url', '');
    const nodeIntegrationEnabled = tabUrl.startsWith('station://')

    const {
      applicationId, applicationName, applicationIcon, themeColor, manifestURL,
      askResetApplication, onChooseAccount,
      crashed, errorCode, errorDescription,
      canGoBack, themeGradient, email,
      promptBasicAuth, performBasicAuth, basicAuthInfo,
      useDefaultSession,
    } = this.props;

    return (
      <div>
        <div
          className={classNames('l-webview__loader', { 'l-webview__loader-active': getTabLoadingState(tab) })}
          style={{ backgroundColor: themeColor! }}
        />

        <ApplicationContainer
          ready={this.state.ready}
          applicationId={applicationId}
          applicationName={applicationName}
          applicationIcon={applicationIcon}
          manifestURL={manifestURL}

          askResetApplication={askResetApplication}
          goBack={this.goBack}
          onChooseAccount={onChooseAccount}
          onApplicationRemoved={this.handleRemoveApplication}

          crashed={crashed}
          errorCode={errorCode}
          errorDescription={errorDescription}

          webView={this.webView}
          tabUrl={tabUrl}

          themeGradient={themeGradient}
          canGoBack={canGoBack}

          promptBasicAuth={promptBasicAuth}
          performBasicAuth={performBasicAuth}
          email={email}

          authInfoHost={basicAuthInfo && basicAuthInfo.get('host')}
          authInfoRealm={basicAuthInfo && basicAuthInfo.get('realm')}
        />

        <LazyWebview
          initialSrc={tabUrl}
          hidden={this.props.hidden}
          className="l-webview__content"
          preload={preloadUrl}
          allowpopups={true}
          loading={this.props.loading}
          webviewRef={this.setWebviewRef}
          partition={useDefaultSession ? '' : `persist:${applicationId}`}
          onPageTitleUpdated={this.handleTitleUpdated}
          onPageFaviconUpdated={this.handleFaviconUpdated}
          onDidStartLoading={this.handleDidStartLoading}
          onDidStopLoading={this.handleDidStopLoading}
          onDidFailLoad={this.handleDidFailLoad}
          onDomReady={this.handleDomReady}
          onCrashed={this.handleWebcontentsCrashed}
          webpreferences={`allowRunningInsecureContent=true,nativeWindowOpen=${useNativeWindowOpen},contextIsolation=false,nodeIntegration=${nodeIntegrationEnabled}`}
        />

      </div>
    );
  }
}

const Application = compose(
  withGetApplicationState({
    options: ({ application, tab }: Props) => ({
      variables: {
        applicationId: application.get('applicationId'),
        tabId: tab.get('tabId'),
      },
    }),
    props: ({ data }) => {
      if (!data) return { loading: true };
      const { application, stationStatus } = oc(data);
      const manifestData = application.manifestData;

      return {
        manifestURL: application.manifestURL(),
        applicationId: data.variables.applicationId,
        applicationName: manifestData.name(),
        applicationIcon: manifestData.interpretedIconURL(),
        themeColor: manifestData.theme_color(),
        notUseNativeWindowOpen: manifestData.bx_not_use_native_window_open_on_host(),
        useDefaultSession: manifestData.bx_use_default_session(),

        isOnline: stationStatus.isOnline(),
        appFocus: stationStatus.focus(),

        loading: data.loading,
        legacyServiceId: manifestData.bx_legacy_service_id(),
      };
    },
  }),
  connect<StateProps, DispatchProps, OwnProps>(
    (state: StationState, ownProps: OwnProps): StateProps => {
      const { application, tab } = ownProps;
      const tabId = getTabId(tab);
      const tabWebcontents = getTabWebcontentsById(state, tabId);

      if (tabWebcontents) {
        return {
          errorCode: tabWebcontents.get('errorCode'),
          errorDescription: tabWebcontents.get('errorDescription'),
          crashed: tabWebcontents.get('crashed'),

          // ApplicationContainer
          email: getApplicationDescription(state, application),
          promptBasicAuth: getWebcontentsAuthState(tabWebcontents),
          basicAuthInfo: getWebcontentsAuthInfo(tabWebcontents),
          canGoBack: getForeFrontNavigationStateProperty(state, 'canGoBack'),
        };
      }

      return {
        // ApplicationContainer
        email: getApplicationDescription(state, application),
        canGoBack: getForeFrontNavigationStateProperty(state, 'canGoBack'),
      } as StateProps;
    },
    (dispatch: any, ownProps: OwnProps): DispatchProps => {
      const { applicationId, tab } = ownProps;
      const tabId = getTabId(tab);

      return bindActionCreators(
        {
          onTitleUpdated: (title) => updateTabTitle(tabId, title),
          onURLUpdated: (url) => updateTabURL(tabId, url),
          onBadgeUpdated: (badge) => updateTabBadge(tabId, badge),
          onFaviconUpdated: (favicons) => updateTabFavicons(tabId, favicons),
          onLoadingStateChanged: (isLoading) => updateLoadingState(tabId, isLoading),
          onLoadingError: (errorCode, errorDescription) => setLoadingError(tabId, errorCode, errorDescription),
          onNotificationClicked: () => navigateToApplicationTab(applicationId, tabId),
          onUpdateApplicationIcon: (imageURL) => updateApplicationIcon(applicationId, imageURL),
          onWebcontentsAttached: (webcontentsId) => attachWebcontentsToTab(tabId, webcontentsId, Date.now()),
          onWebcontentsCrashed: () => setCrashed(tabId),
          onWebcontentsOk: () => setNotCrashed(tabId),
          performBasicAuth: (username, password) => performBasicAuthAction(username, password, tabId),
          onChooseAccount: (identityId) => setConfigData(applicationId, { identityId }),
          onApplicationRemoved: uninstallApplication,
          updateResetAppModal: (appFocus) => updateUI('confirmResetApplicationModal', 'isVisible', appFocus),
        },
        dispatch
      );
    },
    (stateProps: StateProps, dispatchProps: DispatchProps, ownProps: OwnProps): Props => {
      const { appFocus } = ownProps;
      return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
        askResetApplication: () => dispatchProps.updateResetAppModal(appFocus),
      };
    },
  ),
  withActionsBus(),
  withGradient(GradientType.normal),
)(ApplicationImpl);

export default Application;
