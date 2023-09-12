// It is used as a global to know that we are in the worker process
process.worker = true;
// tslint:disable:no-import-side-effect
import './dotenv';
import { ipcRenderer } from 'electron';
import * as remote from '@electron/remote';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { PubSub } from 'graphql-subscriptions';
// @ts-ignore no declaration file
import { updateUI } from 'redux-ui/transpiled/action-reducer';
// @ts-ignore no declaration file
import { openProcessManager, setFullScreenState, setOnlineStatus, toggleKbdShortcuts } from './app/duck';
import { getFocus } from './app/selectors';
import {
  detachCurrentlyFocusedApplicationTab,
  dispatchURLNavigationActiveApp,
  resetZoomActiveApp,
  zoomInActiveApp,
  zoomOutActiveApp,
} from './applications/ApplicationsActions';
import { dispatchUrl } from './applications/duck';
import ManifestProvider from './applications/manifest-provider/manifest-provider';
import DistantFetcher from './applications/manifest-provider/distant-fetcher';
// @ts-ignore no declaration file
import { getForeFrontNavigationStateProperty } from './applications/utils';
// @ts-ignore no declaration file
import { setReleaseNotesSubdockVisibility } from './auto-update/duck';
import * as bang from './bang/duck';
import { AlertDialogProviderServiceImpl } from './dialogs/alertDialogProvider';
// @ts-ignore no declaration file
import * as inTabSearch from './in-tab-search/duck';
import * as notificationCenter from './notification-center/duck';
import { NotificationProps } from './notification-center/types';
import { TabWebContentsAutoLoginDetailsProviderServiceImpl } from './password-managers/autoLoginProvider';
import ResourceRouterDispatcher from './resources/ResourceRouterDispatcher';
import bxSDK from './sdk';
import { handleError } from './services/api/helpers';
import { observer } from './services/lib/helpers';
import { ApolloLinkServiceImpl } from './services/services/apollo-link/worker';
import { AutolaunchProviderServiceImpl } from './services/services/autolaunch/autolaunch-provider/worker';
import { ManifestServiceImpl } from './services/services/manifest/main';
import { IMenuServiceObserverOnClickItemParam } from './services/services/menu/interface';
import { SDKv2ServiceImpl } from './services/services/sdkv2/worker';
import services from './services/servicesManager';
import { configureStore } from './store/configureStore.worker';
import { BasicAuthDetailsProviderServiceImpl } from './tab-webcontents/basicAuthDetailsProvider';
import { executeWebviewMethodForCurrentTab } from './tab-webcontents/duck';
import { WebContentsOverrideProviderServiceImpl } from './tab-webcontents/overrideProvider';
import { StationStoreWorker } from './types';
import * as ui from './ui/duck';
import { NEW_TAB } from './urlrouter/constants';
import { UrlDispatcherProviderServiceImpl } from './urlrouter/urlDispatcherProvider';
import { isPackaged } from './utils/env';
import AboutWindowManager from './windows/utils/AboutWindowManager';
import GenericWindowManager from './windows/utils/GenericWindowManager';
import MainWindowManager from './windows/utils/MainWindowManager';
import URLRouter from './urlrouter/URLRouter';
import { closeCurrentTab } from './tabs/duck';
import { BrowserWindowManagerProviderServiceImpl } from './services/services/browser-window/worker';

export class BrowserXAppWorker {
  public store: StationStoreWorker;
  public mainWindowManager: MainWindowManager;
  public apolloClient: ApolloClient<NormalizedCacheObject>;
  public manifestProvider: ManifestProvider;
  public pubsub: PubSub;
  public router: URLRouter;
  public resourceRouter: ResourceRouterDispatcher;

  constructor() {
    try {
      this.initStore();
      this.initManifestProvider();
      this.pubsub = new PubSub();
      this.initRouter();
      this.initResourceRouter();
      this.initApolloLink();
      this.initWindowManager();
      this.initSDK();
      this.initAppLifeCycle().catch(handleError());
      this.initOnlineListener();
      this.initMenu();
      this.initContextMenu();
      this.initApolloClient();
      this.initAlertProvider().catch(handleError());
      this.initAutoLoginProvider().catch(handleError());
      this.initBasicAuthProvider().catch(handleError());
      this.initUrlDispatcherProvider().catch(handleError());
      this.initWebContentsOverrideProvider().catch(handleError());
      this.initSDKv2();
      this.initAutoLaunch().catch(handleError());
    } catch (e) {
      handleError()(e);
      remote.app.exit(1);
    }
  }

  initManifestProvider() {
    this.manifestProvider = new ManifestProvider({
      // Use native fetch for manifests fetching
      distantFetcher: new DistantFetcher(),
//      cachePath: join(remote.app.getPath('userData'), 'ApplicationManifestsCache'),
    });

    (services.manifest as ManifestServiceImpl).init(this.manifestProvider);
  }

  initRouter() {
    this.router = new URLRouter(this.store.getState, this.manifestProvider);
  }

  initResourceRouter() {
    this.resourceRouter = new ResourceRouterDispatcher(this.store, this.router, this.manifestProvider);
  }

  initApolloLink() {
    (services.apolloLink as ApolloLinkServiceImpl).init(
      this.store,
      this.manifestProvider,
      this.resourceRouter,
      this.pubsub,
    );
  }

  initApolloClient() {
    // local apollo client
    this.apolloClient = new ApolloClient({
      link: (services.apolloLink as ApolloLinkServiceImpl).link!,
      cache: new InMemoryCache({
        // reactive-graphql does not like this
        addTypename: false,
      }),
      // see apollographql/apollo-client#4322
      queryDeduplication: false,
    });
  }

  initAlertProvider() {
    return services.tabWebContents.setAlertDialogProvider(new AlertDialogProviderServiceImpl(this.store));
  }

  initAutoLoginProvider() {
    return services.tabWebContents
      .setAutoLoginDetailsProvider(new TabWebContentsAutoLoginDetailsProviderServiceImpl(this.store));
  }

  initBasicAuthProvider() {
    return services.tabWebContents
      .setBasicAuthDetailsProvider(new BasicAuthDetailsProviderServiceImpl(this.store));
  }

  initUrlDispatcherProvider() {
    return services.tabWebContents
      .setUrlDispatcherProvider(new UrlDispatcherProviderServiceImpl(this.store));
  }

  initWebContentsOverrideProvider() {
    return services.tabWebContents
      .setWebContentsOverrideProvider(new WebContentsOverrideProviderServiceImpl(this.store, this.manifestProvider));
  }

  // this is temporary public
  public handleMenuItemClick({
    event,
    action,
    args,
  }: IMenuServiceObserverOnClickItemParam) {
    switch (action) {
      case 'about':
        AboutWindowManager.show().catch(handleError());
        break;
      case 'settings':
        this.dispatch(ui.toggleVisibility(['settings', 'isVisible']));
        break;
      case 'bang':
        this.mainWindowManager.focus().catch(handleError());
        this.dispatch(bang.toggleVisibility('center-modal', 'topbar_menu_or_keyboard_shortcut'));
        break;
      case 'notification-center':
        this.dispatch(notificationCenter.toggleVisibility());
        break;
      case 'page-reload':
        this.dispatch(executeWebviewMethodForCurrentTab('reload'));
        break;
      case 'page-reset-zoom':
        this.dispatch(resetZoomActiveApp());
        break;
      case 'page-zoom-in':
        this.dispatch(zoomInActiveApp());
        break;
      case 'page-zoom-out':
        this.dispatch(zoomOutActiveApp());
        break;
      case 'page-go-back':
        this.dispatch(executeWebviewMethodForCurrentTab('go-back'));
        break;
      case 'page-go-forward':
        this.dispatch(executeWebviewMethodForCurrentTab('go-forward'));
        break;
      case 'copy-url-to-clipboard':
        this.dispatch(executeWebviewMethodForCurrentTab('copy-url-to-clipboard'));
        break;
      case 'paste-and-match-style':
      case 'paste-and-match-style-hidden':
        this.dispatch(executeWebviewMethodForCurrentTab('paste-and-match-style'));
        break;
      case 'full-screen':
        services.browserWindow.getFocusedWindow()
          .then((w) => {
            if (w) return w.toggleFullscreen();
            return;
          })
          .catch(handleError());
        break;
      case 'app-devtools':
        services.browserWindow.getFocusedWindow()
          .then((w) => {
            if (w) return w.toggleDevTools();
            return;
          })
          .catch(handleError());
        break;
      case 'page-devtools':
        this.dispatch(executeWebviewMethodForCurrentTab('toggle-dev-tools'));
        break;
      case 'worker-devtools':
        services.browserWindow.toggleWorkerDevTools();
        break;
      case 'app-quit':
        services.electronApp.quit().catch(handleError());
        break;
      case 'app-reload':
        services.browserWindow.getFocusedWindow()
          .then((w) => {
            if (w) return w.reload();
            return;
          })
          .catch(handleError());
        break;
      case 'new-page': {
        const [url] = args;
        this.dispatch(dispatchURLNavigationActiveApp(url, { target: NEW_TAB }));
        break;
      }
      case 'find':
        this.dispatch(inTabSearch.activateForCurrentTab());
        break;
      case 'detach-current-tab':
        this.dispatch(detachCurrentlyFocusedApplicationTab());
        break;
      case 'close-current-tab':
        const via = Boolean(event.triggeredByAccelerator) ? 'keyboard-shortcut' : 'click';
        this.dispatch(closeCurrentTab(via));
        break;
      case 'reset-window-position':
        if (this.mainWindowManager.window) {
          this.mainWindowManager.window.resetWindowPosition().catch(handleError());
        }
        break;
      case 'toggle-kbd-shortcuts':
        this.dispatch(toggleKbdShortcuts());
        break;
      case 'show-community':
        this.dispatch(dispatchUrl('https://github.com/getstation/desktop-app/issues'));
        break;
      case 'show-release-notes':
        this.dispatch(setReleaseNotesSubdockVisibility(true));
        break;
      case 'station-features':
        this.dispatch(dispatchUrl('https://getstation.com/features'));
        break;
      case 'reset-current-application':
        this.dispatch(updateUI('confirmResetApplicationModal', 'isVisible', getFocus(this.getState())));
        break;
      case 'open-process-manager':
        this.dispatch(openProcessManager());
        break;
      default:
        throw new Error(`No handled menu action: ${action}`);
    }
  }

  initContextMenu() {
    const handleMenuItemClick = this.handleMenuItemClick.bind(this);
    /* tslint:disable-next-line no-this-assignment */
    const { store } = this;

    services.tabWebContents.addGlobalObserver(observer({
      async onNewWebview(webContentsId: number) {
        const contextMenuService = await services.contextMenu.create({ webcontentsId: webContentsId });

        return contextMenuService.addObserver(observer({
          async onShow(props: Electron.ContextMenuParams) {
            const newProps = !props.misspelledWord ? props : {
              ...props,
              misspellingCorrections: await services.tabWebContents
                .querySpellchecker(webContentsId, props.misspelledWord),
            };
            const state = store.getState();

            contextMenuService.popup({
              props: newProps,
              context: {
                inWebview: true,
                backForwardState: {
                  canGoBack: getForeFrontNavigationStateProperty(state, 'canGoBack'),
                  canGoForward: getForeFrontNavigationStateProperty(state, 'canGoForward'),
                },
              },
            });
          },
          onClickItem(params: IMenuServiceObserverOnClickItemParam) {
            handleMenuItemClick(params);
          },
        }, 'ctx-show-click'));
      },
    }, 'wc-global')).catch(handleError());
  }

  private initStore() {
    this.store = configureStore(this);
    // @ts-ignore debug purpose
    window.stationStore = this.store;
  }

  private initWindowManager() {
    services.browserWindow.setProvider(new BrowserWindowManagerProviderServiceImpl(this.store));
    GenericWindowManager.store = this.store;
    this.mainWindowManager = new MainWindowManager();
    this.mainWindowManager.on('enter-full-screen', () => this.dispatch(setFullScreenState(true)));
    this.mainWindowManager.on('leave-full-screen', () => this.dispatch(setFullScreenState(false)));
    this.mainWindowManager.on('swipe-left', () => this.dispatch(executeWebviewMethodForCurrentTab('go-back')));
    this.mainWindowManager.on('swipe-right', () => this.dispatch(executeWebviewMethodForCurrentTab('go-forward')));
    this.mainWindowManager.on('new-notification', (notificationId: string, props: NotificationProps, options: NotificationOptions) =>
      this.dispatch(notificationCenter.newNotification(undefined, undefined, notificationId, props, options))
    );
  }

  private initSDK() {
    bxSDK.init(this.store, this.resourceRouter);
  }

  private async initAppLifeCycle() {
    // Don't wrap this in this.store.ready()
    // because we want the window to be created as soon as possible
    await this.mainWindowManager.create();

    const onActivate = async () => {
      const isReady = await services.electronApp.isReady();
      if (!isReady) return;
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      await this.mainWindowManager.create();
    };
    services.electronApp.addObserver(observer({ onActivate }, 'app-on-activate')).catch(handleError());
  }

  private initMenu() {
    const { dispatch } = this.store;
    const mainWindowManager = this.mainWindowManager;
    const handleMenuItemClick = this.handleMenuItemClick.bind(this);

    // install the menu
    services.menu.addObserver(observer({
      onClickItem(param: any) {
        // dispatch actions from the menu
        handleMenuItemClick(param);
      },
      onGlobalBangShortcut() {
        if (!mainWindowManager.isCreated()) return;
        dispatch(bang.setVisibility('center-modal', true));
        mainWindowManager.focus();
      },
    }, 'init-menu')).catch(handleError());
  }

  private initOnlineListener() {
    const updateOnlineStatus = (isOnline: boolean) => {
      this.dispatch(setOnlineStatus(isOnline));
    };

    window.addEventListener('online', () => updateOnlineStatus(true));
    window.addEventListener('offline', () => updateOnlineStatus(false));

    updateOnlineStatus(navigator.onLine);
  }

  private initSDKv2() {
    return (services.sdkv2 as SDKv2ServiceImpl).setStore(this.store);
  }

  private async initAutoLaunch() {
    return services.autolaunch.setAutolaunchProvider(new AutolaunchProviderServiceImpl(this.store));
  }

  private dispatch(action: any) {
    return this.store.dispatch(action);
  }

  private getState() {
    return this.store.getState();
  }
}

if (!isPackaged) {
  process.on('unhandledRejection', error => {
    console.trace(error);
  });
}

if (module.hot) {
  module.hot.accept();
  module.hot.addDisposeHandler(() => {
    // We ask the main process to restart as if the main process was edited
    ipcRenderer.send('hmr:worker');
  });
}

export default new BrowserXAppWorker();
