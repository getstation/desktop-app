import * as BluebirdPromise from 'bluebird';
import { app, ipcMain, session } from 'electron';
import log from 'electron-log';
import { omit } from 'ramda';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, share } from 'rxjs/operators';
import { sendToAllWebcontents } from '../../../lib/ipc-broadcast';
import { ServiceSubscription } from '../../lib/class';
import { observer } from '../../lib/helpers';
import { RPC } from '../../lib/types';
import {
  addOnCloseObserver,
  addOnDestroyedObserver,
  addOnDomReadyObserver,
  addOnNavigateObserver,
  addOnNewNotificationObserver,
  addOnNotificationCloseObserver,
  addOnPreventUnload,
  awaitDomReady,
  getWebContentsFromIdOrThrow,
  handleHackGoogleAppsURLs,
} from './api';
import {
  AlertDialogProviderService,
  BasicAuthDetailsProviderService,
  TabWebContentsAutoLoginDetailsProviderService,
  TabWebContentsGlobalObserver,
  TabWebContentsLifeCycleObserver,
  TabWebContentsNotificationsObserver,
  TabWebContentsPrintObserver,
  TabWebContentsService,
  UrlDispatcherProviderService,
  WebContentsOverrideProviderService,
} from './interface';

export class TabWebContentsServiceImpl extends TabWebContentsService implements RPC.Interface<TabWebContentsService> {
  protected webviews: Subject<Electron.WebContents>;
  protected askAutoLogin: Subject<number>;
  protected requestId: number | null;
  protected loop: boolean;

  constructor(uuid?: string) {
    super(uuid);
    this.webviews = new Subject();
    this.askAutoLogin = new Subject();
    this.requestId = null;
    this.loop = false;
    this.initWebviewsListener();
  }

  initWebviewsListener() {
    app.on('web-contents-created', async (_e: any, contents: Electron.WebContents) => {
      if ((contents as any).getType() === 'webview') {
        this.webviews.next(contents);
      }
    });
  }

  async clearHistory(webContentsId: number) {
    (await getWebContentsFromIdOrThrow(webContentsId)).clearHistory();
  }

  async loadURL(webContentsId: number, url: string) {
    (await getWebContentsFromIdOrThrow(webContentsId)).loadURL(url);
  }

  async querySpellchecker(webContentsId: number, misspelledWord: string) {
    const wc = await getWebContentsFromIdOrThrow(webContentsId);

    return await new BluebirdPromise<string[]>(resolve => {
      ipcMain.once('spellchecker-get-correction-response', (_e: any, corrections: string[]) => resolve(corrections));
      wc.send('spellchecker-get-correction', misspelledWord);
    })
      .timeout(200)
      .catch(BluebirdPromise.TimeoutError, () => {
        log.warn('querySpellcheckerInWebContents timeouts');
        return [];
      });
  }

  async print(webContentsId: number) {
    (await getWebContentsFromIdOrThrow(webContentsId)).print();
  }

  async setZoomLevel(webContentsId: number, zoomLevel: number) {
    (await getWebContentsFromIdOrThrow(webContentsId)).setZoomLevel(zoomLevel);
  }

  async findInPage(webContentsId: number, searchString: string, options?: Electron.FindInPageOptions) {
    const wc = await getWebContentsFromIdOrThrow(webContentsId);

    return new Promise<Electron.Result>(resolve => {
      if (wc.isDestroyed()) return resolve();

      wc.once('found-in-page', (_e: any, result: Electron.Result) => {
        // We have a weird behaviour that we haven't successfully reproduced in fiddle yet.
        // When the search reached its last result, and we try to find the next one (which doesn't exist),
        // the main process freezes.
        // The fix is to loop the search like in Chromium, so when we have reached the end,
        // we clear the results and start a fresh search.
        this.loop = result.matches === result.activeMatchOrdinal;
        this.requestId = null;
        resolve(result);
      });

      let opts = options;
      if (this.loop) {
        this.loop = false;
        opts = omit(['findNext'], options);
      }
      this.requestId = wc.findInPage(searchString, opts);
    });
  }

  async stopFindInPage(webContentsId: number) {
    (await getWebContentsFromIdOrThrow(webContentsId)).stopFindInPage('clearSelection');
  }

  async executeJavaScript(webContentsId: number, code: string, userGesture?: boolean) {
    const wc = await getWebContentsFromIdOrThrow(webContentsId);

    await awaitDomReady(wc);
    return wc.executeJavaScript(code, userGesture);
  }

  async askAutoLoginCredentials(webContentsId: number) {
    this.askAutoLogin.next(webContentsId);
  }

  // PROVIDERS

  async setAlertDialogProvider(provider: RPC.Node<AlertDialogProviderService>) {
    return new ServiceSubscription(this.onNewWebviews().subscribe(wc => {
      return fromEvent(wc, 'ipc-message-sync', (event, channel, props) => ({ event, channel, props }))
        .pipe(filter(({ channel }) => channel === 'window-alert'))
        .subscribe(async ({ event, props }) => {
          await provider.show(wc.id, props);
          if (event && event.sendReply) {
            event.sendReply([]);
          }
        });
    }));
  }

  async setAutoLoginDetailsProvider(provider: RPC.Node<TabWebContentsAutoLoginDetailsProviderService>) {
    const shared = this.onNewWebviews().pipe(share());
    return new ServiceSubscription([
      this.askAutoLogin.subscribe(async (webContentsId: number) => {
        const wc = await getWebContentsFromIdOrThrow(webContentsId);

        const { account, canAutoSubmit } = await provider.getCredentials(wc.id);
        if (account) {
          wc.focus();
          wc.send('autologin-value-retrieved', account, canAutoSubmit);
        }
      }),
      shared.subscribe(wc => {
        return fromEvent(wc, 'ipc-message', (_e, channel) => channel)
          .pipe(filter(channel => channel === 'autologin-get-credentials'))
          .subscribe(() => {
            return this.askAutoLoginCredentials(wc.id);
          });
      }),
      shared.subscribe(wc => {
        return fromEvent(wc, 'ipc-message', (_e, channel) => channel)
          .pipe(filter(channel => channel === 'autologin-display-removeLinkBanner'))
          .subscribe(async () => {
            await provider.showRemoveLinkBanner(wc.id);
          });
      }),
      shared.subscribe(wc => {
        return fromEvent(wc, 'did-navigate')
          .subscribe(async () => {
            await provider.hideBanners(wc.id);
          });
      }),
      shared.subscribe(wc => {
        return fromEvent(wc, 'did-navigate-in-page')
          .subscribe(async () => {
            await provider.hideBanners(wc.id);
          });
      }),
    ]);
  }

  async setBasicAuthDetailsProvider(provider: RPC.Node<BasicAuthDetailsProviderService>) {
    return new ServiceSubscription(this.onNewWebviews().subscribe(wc => {
      return fromEvent(wc, 'login', (event, _request, authInfo, callback) => ({ event, authInfo, callback }))
        .subscribe(async ({ event, authInfo, callback }) => {
          event.preventDefault();
          const { username, password } = await provider.getAuthData(wc.id, authInfo);
          callback(username, password);
        });
    }));
  }

  async setWebContentsOverrideProvider(provider: RPC.Node<WebContentsOverrideProviderService>) {
    return new ServiceSubscription(this.onNewWebviews().subscribe(async wc => {
      const data = await provider.getOverrideData(wc.id);
      if (data.userAgent) {
        let userAgentWithRealOS = data.userAgent;
        const defaultUserAgent = session.defaultSession?.getUserAgent();
        const baseOSUserAgent = defaultUserAgent?.match(/\(([^()]*)\)/m);
        // Preventing any pb about the non respect of UserAgent format,prefer to have a valid one in all cases
        if (baseOSUserAgent && baseOSUserAgent.length > 1) {
          userAgentWithRealOS = data.userAgent.replace(/\(([^()]*)\)/m, baseOSUserAgent[0]);
        }
        wc.setUserAgent(userAgentWithRealOS);
      }
    }));
  }

  async setUrlDispatcherProvider(provider: RPC.Node<UrlDispatcherProviderService>) {
    return new ServiceSubscription(this.onNewWebviews().subscribe(wc => {
      return fromEvent(wc, 'new-window', (event, url, _, disposition, options) => ({ event, url, disposition, options }))
        .subscribe(async ({ event, url, disposition, options }) => {
          if (disposition === 'new-window') {
            if (options) {
              options.fullscreen = false;
            }
          } else if (disposition === 'foreground-tab' && String(url).startsWith('about:blank')) {
            // Gmail PDF hack. Will download a printed PDF from thumbnail
            // EDIT: not only Gmail or just PDF but most of the URL link on a Google app with overriden User Agent
            // also falls here
            event.preventDefault();
            const guest = await handleHackGoogleAppsURLs(event, options);

            if (guest) { // not a download
              const newWindowUrl = guest.webContents.getURL();
              if (newWindowUrl.startsWith('about:blank')) {
                // if popup is still blank after 2 seconds, we show it to let it finish
                guest.show();
              } else {
                guest.close();
                // otherwise dispatch the current URL of the guest window into our URLRouter
                await provider.dispatchUrl(newWindowUrl, wc.id);
              }
            }
          } else {
            event.preventDefault();
            await provider.dispatchUrl(url, wc.id);
          }
        });
    }));
  }

  // OBSERVERS

  async addGlobalObserver(obs: RPC.ObserverNode<TabWebContentsGlobalObserver>) {
    if (obs.onNewWebview) {
      return new ServiceSubscription(
        this.webviews.asObservable()
          .subscribe(wc => {
            obs.onNewWebview!(wc.id);
          }),
        obs
      );
    }
    return ServiceSubscription.noop;
  }

  async addLifeCycleObserver(webContentsId: number, obs: RPC.ObserverNode<TabWebContentsLifeCycleObserver>) {
    const wc = await getWebContentsFromIdOrThrow(webContentsId);

    const sub = new ServiceSubscription([
      addOnDestroyedObserver(wc, obs),
      addOnDomReadyObserver(wc, obs),
      addOnCloseObserver(wc, obs),
      addOnNavigateObserver(wc, obs),
      addOnPreventUnload(wc, obs),
    ], obs);
    wc.once('destroyed', () => {
      sub.unsubscribe();
      // Can be leveraged by worker to simply know when a webcontents is destroyed
      sendToAllWebcontents(`wc-destroyed-${webContentsId}`);
    });
    return sub;
  }

  async addNotificationsObserver(webContentsId: number, obs: RPC.ObserverNode<TabWebContentsNotificationsObserver>) {
    const wc = await getWebContentsFromIdOrThrow(webContentsId);

    const sub = new ServiceSubscription([
      addOnNewNotificationObserver(wc, obs),
      addOnNotificationCloseObserver(wc, obs),
    ], obs);
    wc.once('destroyed', () => {
      sub.unsubscribe();
    });
    return sub;
  }

  async addPrintObserver(webContentsId: number, obs: RPC.ObserverNode<TabWebContentsPrintObserver>) {
    const wc = await getWebContentsFromIdOrThrow(webContentsId);
    if (!wc) return ServiceSubscription.noop;

    if (obs.onPrint) {
      const sub = new ServiceSubscription(
        fromEvent(wc, 'ipc-message', (_e, channel) => channel)
          .pipe(filter(channel => channel === 'print'))
          .subscribe(() => {
            obs.onPrint!();
          }),
        obs
      );
      wc.once('destroyed', () => {
        sub.unsubscribe();
      });
      return sub;
    }
    return ServiceSubscription.noop;
  }

  // Easily use local new webviews observer as an Observable
  protected onNewWebviews() {
    return new Observable<Electron.WebContents>(o => {
      this.addGlobalObserver(observer({
        async onNewWebview(webContentsId: number) {
          const wc = await getWebContentsFromIdOrThrow(webContentsId);
          try {
            o.next(wc);
          } catch (e) {
            o.error(e);
          }
        },
      })).catch(e => o.error(e));
    });
  }
}
