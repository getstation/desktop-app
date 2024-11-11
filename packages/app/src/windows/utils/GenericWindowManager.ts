import { EventEmitter } from 'events';
import { Action, Store } from 'redux';

import { changeAppFocusState } from '../../app/duck';
import { NotificationProps } from '../../notification-center/types';
import { handleError } from '../../services/api/helpers';
import { observer } from '../../services/lib/helpers';
import { RPC } from '../../services/lib/types';
import { BrowserWindowService, BrowserWindowServiceConstructorOptions } from '../../services/services/browser-window/interface';
import services from '../../services/servicesManager';
import { isPackaged } from '../../utils/env';
import { windowCreated, windowDeleted } from '../duck';

let allowDispatch = true;
services.electronApp
  .addObserver(
    observer(
      {
        onBeforeQuit() {
          allowDispatch = false;
        },
      },
      'gwm-quit'
    )
  )
  .catch(handleError());

export default class GenericWindowManager extends EventEmitter {

  public static store: Store<any>;
  protected static FILEPATH: string;
  public window?: RPC.Node<BrowserWindowService>;
  public windowId?: number;

  static dispatch(a: Action) {
    if (allowDispatch && GenericWindowManager.store) {
      GenericWindowManager.store.dispatch(a);
    }
  }

  static focus(webviewId: number) {
    return services.browserWindow.focus(webviewId).catch(
      handleError({
        console: false,
        log: true,
      })
    );
  }

  isCreated(): this is Required<GenericWindowManager> {
    return Boolean(this.window);
  }

  async close() {
    if (this.isCreated()) await this.window.close();
  }

  async show() {
    if (this.isCreated()) {
      await this.window.show();
      setTimeout(async () => {
        if (!this.window) return;
        // Wait for window to be initialised, and for potential `blur()` to be triggered beforehand
        await this.window.focus();
      }, 1000);
    }
  }

  async focus() {
    if (this.isCreated()) {
      await this.window.focus();
    }
  }

  async create(options: BrowserWindowServiceConstructorOptions, shownow: boolean = false) {
    if (this.isCreated()) return this.window;

    this.window = await services.browserWindow.create({
      ...options,
      preventNavigation: true,
      webPreferences: {
        nodeIntegration: true,
        webviewTag: true,
        // The following 2 parameters combined will disable the `same-origin` policy.
        // This allows any window (and the worker) to make http requests to externals services
        // without being filtered.
        // For instance, without this, when the app runs with localhost files in dev,
        // and it tries to make a request to the Slack API, the request sees all of its cookies disappear.
        // With those parameters, the cookies are automatically added whatever the origin.
        //
        // Adding the cookies on-the-fly thanks to `session.webRequest.onBeforeSendHeaders` doesn't do anything.
        // @see https://gist.github.com/magne4000/15201a636978a1458095a996f2b26f25 for reproduction steps.
        //
        // A better solution would be to run those requests inside the context of their designated webviews
        // (i.e. make slack calls inside the slack webview context).
        webSecurity: false,
        allowRunningInsecureContent: false,
        contextIsolation: false,
      },
    });

    this.emit('window-created');
    this.windowId = await this.window.getId();
    const webContentsId = await this.window.getWebContentsId();

    /* tslint:disable-next-line no-this-assignment */
    const self = this;

    this.window.addObserver(
      observer(
        {
          onReadyToShow() {
            self.show();
            if (!isPackaged) {
              self.window && self.window.openDevTools();
            }
          },
          onShow() {
            self.emit('shown');
          },
          onBeforeUnload() {
            self.emit('beforeunload');
          },
          onDidFinishLoad() {
            self.emit('loaded');
          },
          onClosed() {
            GenericWindowManager.dispatch(windowDeleted(self.windowId));
            self.window = undefined;
            self.windowId = undefined;
            self.emit('closed');
          },
          onEnterFullScreen() {
            self.emit('enter-full-screen');
          },
          onLeaveFullScreen() {
            self.emit('leave-full-screen');
          },
          onFocus() {
            self.emit('focus');
          },
          onBlur() {
            self.emit('blur');
          },
          onSwipe(direction: 'up' | 'right' | 'down' | 'left') {
            self.emit(`swipe-${direction}`);
          },
          onContextMenu(params: Electron.ContextMenuParams) {
            self.emit('context-menu', params);
          },
          onNewNotification(notificationId: string, props: NotificationProps) {
            self.emit('new-notification', notificationId, props, {
              webContentsId,
            });
          },
          onMinimize() {
            self.emit('minimize');
          }
        },
        'gwm'
      )
    );

    if (shownow) {
      await this.show();
    }

    this.initFocusWatcher();
    this.initDispatch();

    return this.window;
  }

  load(filepath?: string) {
    if (!this.isCreated()) return;
    const fp = filepath || (<typeof GenericWindowManager>this.constructor).FILEPATH;
    if (!fp) throw new Error(`Invalid loadURL parameter: ${fp}`);
    return this.window.load(fp);
  }

  initFocusWatcher() {
    this.on('blur', () => {
      GenericWindowManager.dispatch(changeAppFocusState(null));
    });

    this.on('focus', () => {
      setTimeout(async () => {
        if (this.window && (await this.window.isFocused())) {
          GenericWindowManager.dispatch(changeAppFocusState(this.windowId));
        }
      }, 1);
    });
  }

  initDispatch() {
    GenericWindowManager.dispatch(windowCreated(this.windowId));
  }

  reload() {
    if (!this.isCreated()) return Promise.resolve();
    return this.window.reload();
  }

  toggleDevTools() {
    if (!this.isCreated()) return Promise.resolve();
    return this.window.toggleDevTools();
  }

  toggleFullscreen() {
    if (!this.isCreated()) return Promise.resolve();
    return this.window.toggleFullscreen();
  }

  hide() {
    if (!this.isCreated()) return Promise.resolve();
    return this.window.hide();
  }
}
