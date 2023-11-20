import { BrowserWindow, session, webContents } from 'electron';
import { fromEvent, merge } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { RPC } from '../../lib/types';
import { TabWebContentsLifeCycleObserver, TabWebContentsNotificationsObserver } from './interface';

/**
 * `webContents` IDs are sometimes available before the actual `webContents`
 * is retrievable through `webContents.fromId` (in which case it returns `null`).
 * To circumvent this issue, we try to retrieve the webContents in consecutive process ticks
 * `maxTries` number of times, and we throw if we still have `null` at the end.
 * This method should be used to replace `webContents.fromId` in strongly async workflows.
 */
export const getWebContentsFromIdOrThrow = async (webContentsId: number, maxTries: number = 3) => {
  let count = maxTries;
  let wc: Electron.WebContents | null = null;
  while (wc === null && count > 0) {
    wc = await new Promise(resolve => {
      process.nextTick(() => {
        resolve(webContents.fromId(webContentsId));
      });
    });
    count = count - 1;
  }
  if (!wc) {
    throw new Error(`Unable to retrieve webContents ${webContentsId}`);
  }
  return wc;
};

export const addOnDestroyedObserver = (wc: Electron.WebContents, obs: RPC.ObserverNode<TabWebContentsLifeCycleObserver>) => {
  if (obs.onDestroyed) {
    return fromEvent(wc, 'destroyed')
      .pipe(take(1))
      .subscribe(() => {
        obs.onDestroyed!();
      });
  }
  return () => { };
};

export const awaitDomReady = (wc: Electron.WebContents) => {
  return new Promise<void>((resolve) => {
    if (wc.isLoading()) {
      wc.once('dom-ready', () => setTimeout(resolve, 250));
    } else {
      resolve();
    }
  });
};

export const addOnDomReadyObserver = (wc: Electron.WebContents, obs: RPC.ObserverNode<TabWebContentsLifeCycleObserver>) => {
  if (obs.onDomReady) {
    return fromEvent(wc, 'dom-ready')
      .subscribe(() => {
        obs.onDomReady!();
      });
  }
  return () => { };
};

export const addOnCloseObserver = (wc: Electron.WebContents, obs: RPC.ObserverNode<TabWebContentsLifeCycleObserver>) => {
  if (obs.onClose) {
    return fromEvent(wc, 'close')
      .subscribe(() => {
        obs.onClose!();
      });
  }
  return () => { };
};

export const addOnNavigateObserver = (wc: Electron.WebContents, obs: RPC.ObserverNode<TabWebContentsLifeCycleObserver>) => {
  if (obs.onNavigate) {
    const allEvents = merge(
      fromEvent(wc, 'did-fail-load'),
      fromEvent(wc, 'did-finish-load'),
      fromEvent(wc, 'did-navigate-in-page'),
    );
    return allEvents.subscribe(() => {
      obs.onNavigate!({
        canGoBack: wc.canGoBack(),
        canGoForward: wc.canGoForward(),
      });
    });
  }
  return () => { };
};

// Attached listener to `window.beforeunload` event will block page reloading
// Prevent default `will-prevent-unload` will force webContents reload
// Chrome practise is to prompt a dialog for confirmation
// ref: https://electronjs.org/docs/api/web-contents#event-will-prevent-unload
export const addOnPreventUnload = (wc: Electron.WebContents, _: RPC.ObserverNode<TabWebContentsLifeCycleObserver>) => {
  wc.on('will-prevent-unload', (event: Electron.Event) => event.preventDefault());

  return () => { };
};

export const addOnNewNotificationObserver = (wc: Electron.WebContents, obs: RPC.ObserverNode<TabWebContentsNotificationsObserver>) => {
  if (obs.onNewNotification) {
    return fromEvent(wc, 'ipc-message', (_e, channel, id, props) => ({ channel, id, props }))
      .pipe(filter(({ channel }) => channel === 'new-notification'))
      .subscribe(({ id, props }) => {
        obs.onNewNotification!({
          ...props,
          id,
        });
      });
  }
  return () => { };
};

export const addOnNotificationCloseObserver = (wc: Electron.WebContents, obs: RPC.ObserverNode<TabWebContentsNotificationsObserver>) => {
  if (obs.onNotificationClose) {
    return fromEvent(wc, 'ipc-message', (_e, channel, id) => ({ channel, id }))
      .pipe(filter(({ channel }) => channel === 'notification-close'))
      .subscribe(({ id }) => {
        obs.onNotificationClose!(id);
      });
  }
  return () => { };
};

/**
 * Gmail has a weird way to open PDF for printing.
 * They are opened with a `about:blank` or `about:blank#blocked` url, then code is injected into the new tab/window,
 * which is then redirected to a new URL which will trigger the print.
 *
 * What we are doing to handle this case:
 * - Create a new hidden BrowserWindow and attach is to `event.newGuest`
 * - Wait for this window to trigger a download
 * - If within 2 seconds we received a download, we close the window
 * - Else, we show it or dispatch it
 *
 * NB: When overriding the User Agent to bypass Google blacklist, ALL URLs seems to be handled that way instead of just downloads...
 *
 * NB: As the print PDF thingy is tied to the PDF viewer which doesn't really work in Electron yet,
 *     we receive a download event instead of a print event.
 */
export const handleHackGoogleAppsURLs =
  async (event: Event, options: Partial<Electron.BrowserWindowConstructorOptions>): Promise<BrowserWindow | undefined> => {
    const actualOptions: Electron.BrowserWindowConstructorOptions = {
      ...options,
      width: 400,
      height: 400,
      show: false,
    };
    const guest = new BrowserWindow(actualOptions);
    (event as any).newGuest = guest;

    // Wait 2 seconds to receive a downloadItem
    const downloadItem = await Promise.race([
      new Promise<boolean>(resolve => {
        session.defaultSession!.once('will-download', () => resolve(true));
      }),
      new Promise<void>(resolve => { setTimeout(resolve, 2000); }),
    ]);

    // If download event received, we close the webcontents
    if (downloadItem) {
      guest.close();
      return;
    }

    return guest;
  };
