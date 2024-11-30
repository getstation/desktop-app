import { BrowserWindow, ipcMain, screen } from 'electron';
import * as remoteMain from '@electron/remote/main';
import * as windowStateKeeper from 'electron-window-state';
import { fromEvent } from 'rxjs';
import { NotificationProps } from '../../../notification-center/types';
import { ServiceSubscription } from '../../lib/class';
import { RPC } from '../../lib/types';
import { BrowserWindowService, BrowserWindowServiceConstructorOptions, BrowserWindowServiceObserver } from './interface';

const noop = () => {};

export class BrowserWindowServiceImpl extends BrowserWindowService implements RPC.Interface<BrowserWindowService> {

  public window: Electron.BrowserWindow;
  protected stateManager?: windowStateKeeper.State;

  constructor(options: BrowserWindowServiceConstructorOptions) {
    super();
    const positionOptions = this.startInitPositionManager(options.savePosition);
    this.window = new BrowserWindow({
      ...positionOptions,
      ...options,
    });

    remoteMain.enable(this.window.webContents);

    // app.on(
    //     'web-contents-created',
    //     (event: Event, webContents: WebContents) => {
    //         require('electron-log').info(`CC [ ${webContents.id} ] ${process.type} ${webContents.getURL()}`);
    //         remoteMain.enable(webContents);
    //     }
    // );

    // this.window.webContents.on(
    //     'did-attach-webview', 
    //     (event: Event, webContents: WebContents) => {
    //       require('electron-log').info(`BB [ ${webContents.id} ] ${process.type} ${webContents.getURL()}`);
    //       remoteMain.enable(webContents);
    //         // const all = webContents.getAllWebContents();
    //         // all.forEach((item) => {
    //         //     remoteMain.enable(item);
    //         // });
    //     }
    // );

    // this.window.webContents.on(
    //   'will-attach-webview', 
    //   (event: Event, webPreferences: Electron.WebPreferences /*, params: Record<string, string> */) => {
    //       webPreferences.nodeIntegration = true;
    //       webPreferences.nodeIntegrationInSubFrames = true;
    //       webPreferences.nodeIntegrationInWorker = true;
    //       webPreferences.webSecurity = false;
    //       const all = webContents.getAllWebContents();
    //       all
    //         .forEach(wc => {
    //             require('electron-log').info(`AA [ ${wc.id} ] ${process.type} ${wc.getURL()}`);
    //             // remoteMain.enable(wc);
    //         });
    //     }
    // );


    if (options.preventNavigation) {
      this.window.webContents.on('will-navigate', event => event.preventDefault());
    }
    this.window.once('closed', () => {
      setTimeout(() => this.destroy(), 1000);
    });
    this.endInitPositionManager();
  }

  async getId() {
    return this.window.id;
  }

  async getWebContentsId() {
    return this.window.webContents.id;
  }

  async focus() {
    this.window.focus();
  }

  async close() {
    this.window.close();
  }

  async show() {
    this.window.show();
  }

  async hide() {
    this.window.hide();
  }

  async load(url: string) {
    this.window.loadURL(url);
  }

  async reload() {
    this.window.webContents.reload();
  }

  async openDevTools() {
    await this.window.webContents.openDevTools();
  }

  async toggleDevTools() {
    await this.window.webContents.toggleDevTools();
  }

  async toggleFullscreen() {
    this.window.setFullScreen(!this.window.isFullScreen());
  }

  async toggleMaximize() {
    if (this.window.isMaximized()) {
      this.window.unmaximize();
    } else {
      this.window.maximize();
    }
  }

  async resetWindowPosition() {
    if (this.stateManager) {
      (this.stateManager as any).resetStateToDefault();
      this.stateManager.saveState(this.window);
    }

    const screenSize = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workArea;
    this.window.setPosition(screenSize.x, screenSize.y);

    if (this.stateManager) {
      this.window.setSize(this.stateManager.width, this.stateManager.height);
    }
  }

  async getBounds() {
    return this.window.getBounds();
  }

  async isFocused() {
    return this.window.isFocused();
  }

  /**
   * Data attached by the main process on the `window` object can be read directly by the process in question.
   * Used mainly by Subwindows.
   * @param metadata
   */
  async setMetadata<T extends object>(metadata: T) {
    Object.assign(this.window, metadata);
  }

  async addObserver(obs: RPC.ObserverNode<BrowserWindowServiceObserver>) {
    return new ServiceSubscription([
      this.onAny('focus', obs.onFocus),
      this.onAny('blur', obs.onBlur),
      this.onAny('show', obs.onShow),
      this.onAny('beforeunload', obs.onBeforeUnload),
      this.onAny('closed', obs.onClosed),
      this.onAny('enter-full-screen', obs.onEnterFullScreen),
      this.onAny('leave-full-screen', obs.onLeaveFullScreen),
      this.onAny('minimize', obs.onMinimize),
      this.onAnyWebContents('did-finish-load', obs.onDidFinishLoad),
      this.onReadyToShow(obs.onReadyToShow),
      this.onContextMenu(obs.onContextMenu),
      this.onSwipe(obs.onSwipe),
      this.onNewNotification(obs.onNewNotification),
    ], obs, this);
  }

  private onAny(key: string, callback?: Function) {
    if (!callback) return noop;
    return fromEvent(this.window, key).subscribe(() => callback());
  }

  private onAnyWebContents(key: string, callback?: Function) {
    if (!callback) return noop;
    return fromEvent(this.window.webContents, key).subscribe(() => callback());
  }

  private onContextMenu(callback?: RPC.ObserverNode<BrowserWindowServiceObserver>['onContextMenu']) {
    if (!callback) return noop;
    return fromEvent(this.window.webContents, 'context-menu', (_e, params) => params).subscribe(callback);
  }

  private onSwipe(callback?: RPC.ObserverNode<BrowserWindowServiceObserver>['onSwipe']) {
    if (!callback) return noop;
    return fromEvent(this.window, 'swipe', (_e, direction) => direction).subscribe(callback);
  }

  private onReadyToShow(callback?: Function) {
    if (!callback) return noop;
    const cb = (event: Electron.IpcMainEvent) => {
      if (event.sender === this.window.webContents) {
        callback();
        ipcMain.removeListener('bx-ready-to-show', cb);
      }
    };
    ipcMain.on('bx-ready-to-show', cb);

    return () => ipcMain.removeListener('bx-ready-to-show', cb);
  }

  private onNewNotification(callback?: Function) {
    if (!callback) return noop;
    const cb = (event: Electron.IpcMainEvent, notificationId: string, props: NotificationProps) => {
      if (event.sender === this.window.webContents) {
        callback(notificationId, props);
      }
    };
    ipcMain.on('new-notification', cb);

    return () => ipcMain.removeListener('new-notification', cb);
  }

  private startInitPositionManager(savePosition?: string): Partial<BrowserWindowServiceConstructorOptions> {
    if (!savePosition) return {};
    const sanitize = require('sanitize-filename');
    const sanitizedFilename = sanitize(savePosition);
    if (!sanitizedFilename) throw new Error(`Invalid file name ${savePosition}`);

    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    this.stateManager = windowStateKeeper({
      defaultWidth: width - 40,
      defaultHeight: height - 40,
      file: `${sanitizedFilename}.json`,
    });

    return {
      x: this.stateManager.x,
      y: this.stateManager.y,
      center: !this.stateManager.x && !this.stateManager.y,
      width: this.stateManager.width > 5 ? this.stateManager.width : 1024,
      height: this.stateManager.height > 5 ? this.stateManager.height : 728,
    };
  }

  private endInitPositionManager() {
    if (!this.stateManager) return;
    this.stateManager.manage(this.window);
  }

  async setAlwaysOnTop(flag: boolean, level?: 'normal' | 'floating' | 'torn-off-menu' | 'modal-panel' | 'main-menu' | 'status' | 'pop-up-menu' | 'screen-saver', relativeLevel?: number) {
    this.window.setAlwaysOnTop(flag, level, relativeLevel); 
  }
}
