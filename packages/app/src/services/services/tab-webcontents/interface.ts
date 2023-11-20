import { Account } from '../../../password-managers/types';
import { ServiceBase } from '../../lib/class';
import { service, timeout } from '../../lib/decorator';
import { RPC } from '../../lib/types';
import { NEW_TAB, Targets } from '../../../urlrouter/constants';
/**
 * Service used to interact with WebContents related to tabs
 */
@service('webcontents')
export class TabWebContentsService extends ServiceBase implements RPC.Interface<TabWebContentsService> {
  // @ts-ignore
  setZoomLevel(webContentsId: number, zoomLevel: number): Promise<void> { }
  // @ts-ignore
  clearHistory(webContentsId: number): Promise<void> { }
  // @ts-ignore
  findInPage(webContentsId: number, searchString: string, options?: Electron.FindInPageOptions): Promise<Electron.Result | null> { }
  // @ts-ignore
  stopFindInPage(webContentsId: number): Promise<void> { }
  // @ts-ignore
  print(webContentsId: number): Promise<void> { }
  // @ts-ignore
  loadURL(webContentsId: number, url: string): Promise<void> { }
  // TODO: make this into a dedicated SpellcheckerService
  // @ts-ignore
  querySpellchecker(webContentsId: number, misspelledWord: string): Promise<string[]> { }
  // @ts-ignore
  autofillEmail(webContentsId: number): Promise<string[]> { }

  @timeout(0) // some JS code could require more time than default timeout
  // @ts-ignore
  executeJavaScript(webContentsId: number, code: string, userGesture?: boolean): Promise<any> { }
  // @ts-ignore
  askAutoLoginCredentials(webContentsId: number): Promise<void> { }

  // -- Providers --
  // Providers are a way to inject dependencies into a Service implementation.
  // It allows us to delegate some logic to another process.

  /**
   * Delegate `alert(...)` handling
   */
  // @ts-ignore
  setAlertDialogProvider(provider: RPC.Node<AlertDialogProviderService>): Promise<RPC.Subscription> { }
  /**
   * Delegate auto login behaviour
   */
  // @ts-ignore
  setAutoLoginDetailsProvider(provider: RPC.Node<TabWebContentsAutoLoginDetailsProviderService>): Promise<RPC.Subscription> { }
  /**
   * Delegate basic auth data retrieval
   */
  // @ts-ignore
  setBasicAuthDetailsProvider(provider: RPC.Node<BasicAuthDetailsProviderService>): Promise<RPC.Subscription> { }
  /**
   * Delegate URL dispatching
   */
  @timeout(5000)
  // @ts-ignore
  setUrlDispatcherProvider(provider: RPC.Node<UrlDispatcherProviderService>): Promise<RPC.Subscription> { }
  /**
   * Delegate custom overrides of webContents properties
   */
  // @ts-ignore
  setWebContentsOverrideProvider(provider: RPC.Node<WebContentsOverrideProviderService>): Promise<RPC.Subscription> { }

  // -- Observers --

  /**
   * Register global events, i.e. which does not concern a webContents in particular
   */
  // @ts-ignore
  addGlobalObserver(obs: RPC.ObserverNode<TabWebContentsGlobalObserver>): Promise<RPC.Subscription> { }
  // @ts-ignore
  addNotificationsObserver(webContentsId: number, obs: RPC.ObserverNode<TabWebContentsNotificationsObserver>): Promise<RPC.Subscription> { }
  // @ts-ignore
  addPrintObserver(webContentsId: number, obs: RPC.ObserverNode<TabWebContentsPrintObserver>): Promise<RPC.Subscription> { }
  // @ts-ignore
  addLifeCycleObserver(webContentsId: number, obs: RPC.ObserverNode<TabWebContentsLifeCycleObserver>): Promise<RPC.Subscription> { }
}

@service('webcontents', { observer: true })
export class TabWebContentsGlobalObserver extends ServiceBase implements RPC.Interface<TabWebContentsGlobalObserver> {
  // @ts-ignore
  onNewWebview(webContentsId: number): void { }
}

@service('webcontents', { observer: true })
export class TabWebContentsPrintObserver extends ServiceBase implements RPC.Interface<TabWebContentsPrintObserver> {
  // @ts-ignore
  onPrint(): void { }
}

@service('webcontents', { observer: true })
export class TabWebContentsLifeCycleObserver extends ServiceBase implements RPC.Interface<TabWebContentsLifeCycleObserver> {
  // @ts-ignore
  onDestroyed(): void { }
  // @ts-ignore
  onDomReady(): void { }
  // @ts-ignore
  onClose(): void { }
  // @ts-ignore
  onNavigate(props: { canGoBack: boolean, canGoForward: boolean }): void { }
  // @ts-ignore
  onPreventUnload(): void { }
}

@service('webcontents', { observer: true })
export class TabWebContentsPropertiesObserver extends ServiceBase implements RPC.Interface<TabWebContentsPropertiesObserver> {
  // @ts-ignore
  onUpdate(properties: TabWebContentsProperties): void { }
}

@service('webcontents', { observer: true })
export class TabWebContentsNotificationsObserver extends ServiceBase implements RPC.Interface<TabWebContentsNotificationsObserver> {
  // @ts-ignore
  onNewNotification(props: NewNotificationProps): void { }
  // @ts-ignore
  onNotificationClose(id: string): void { }
}

@service('webcontents')
export class UrlDispatcherProviderService extends ServiceBase
  implements RPC.Interface<UrlDispatcherProviderService> {
  // @ts-ignore
  dispatchUrl(url: string, originWebContentsId: number, target: Targets = NEW_TAB): void { }
}

@service('webcontents')
export class TabWebContentsAutoLoginDetailsProviderService extends ServiceBase
  implements RPC.Interface<TabWebContentsAutoLoginDetailsProviderService> {
  @timeout(12000)
  // @ts-ignore
  getCredentials(webContentsId: number): Promise<{ canAutoSubmit: boolean, account?: Account }> { }
  // @ts-ignore
  showRemoveLinkBanner(webContentsId: number): Promise<void> { }
  // @ts-ignore
  hideBanners(webContentsId: number): Promise<void> { }
}

@service('webcontents')
export class BasicAuthDetailsProviderService extends ServiceBase implements RPC.Interface<BasicAuthDetailsProviderService> {
  @timeout(0) // will wait for user input
  // @ts-ignore
  getAuthData(webContentsId: number, authInfo: Electron.AuthInfo): Promise<{ username: string, password: string }> { }
}

@service('webcontents')
export class AlertDialogProviderService extends ServiceBase implements RPC.Interface<AlertDialogProviderService> {
  @timeout(0) // will wait for user input
  // The Promise returns when the alert has been clicked
  // @ts-ignore
  show(webContentsId: number, props: { message: string, title: string }): Promise<void> { }
}

@service('webcontents')
export class WebContentsOverrideProviderService extends ServiceBase implements RPC.Interface<WebContentsOverrideProviderService> {
  @timeout(10000) // could be longer than 2 seconds
  // @ts-ignore
  getOverrideData(webContentsId: number): Promise<WebContentsOverrideData> { }
}

// To complete if we need to override once at loading some other parameters
export interface WebContentsOverrideData {
  userAgent?: string;
}

export interface NewNotificationProps {
  id: string;
  timestamp: number;
  title: string;
  body: string;
  icon: string;
}

export interface TabWebContentsProperties {
  canGoBack: boolean;
  canGoForward: boolean;
  title: string;
  url: string;
}
