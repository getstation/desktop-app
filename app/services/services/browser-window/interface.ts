import { NotificationProps } from '../../../notification-center/types';
import { ServiceBase } from '../../lib/class';
import { service } from '../../lib/decorator';
import { RPC } from '../../lib/types';

export type BrowserWindowServiceConstructorOptions =
  Electron.BrowserWindowConstructorOptions & {
    // - If undefined, do not load/save position
    // - If string, leverage `electron-window-state`
    //   and set its `file` parameter to `${savePosition}.json`
    savePosition?: string,
    preventNavigation?: boolean,
  };

@service('browser-window')
export class BrowserWindowService extends ServiceBase implements RPC.Interface<BrowserWindowService> {
  // TODO the `id` of a BrowserWindow never changes. -> Find a way to cache first call on Node
  // @ts-ignore
  getId(): Promise<number> {}
  // @ts-ignore
  getWebContentsId(): Promise<number> {}
  // @ts-ignore
  focus(): Promise<void> {}
  // @ts-ignore
  close(): Promise<void> {}
  // @ts-ignore
  show(): Promise<void> {}
  // @ts-ignore
  hide(): Promise<void> {}
  // @ts-ignore
  load(url: string): Promise<void> {}
  // @ts-ignore
  reload(): Promise<void> {}
  // @ts-ignore
  openDevTools(): Promise<void> {}
  // @ts-ignore
  toggleDevTools(): Promise<void> {}
  // @ts-ignore
  toggleFullscreen(): Promise<void> {}
  // @ts-ignore
  toggleMaximize(): Promise<void> {}
  // @ts-ignore
  resetWindowPosition(): Promise<void> {}
  // @ts-ignore
  getBounds(): Promise<Electron.Rectangle> {}
  // @ts-ignore
  setMetadata<T extends object>(metadata: T): Promise<void> {}
  // @ts-ignore
  isFocused(): Promise<boolean> {}

  // @ts-ignore
  addObserver(observer: RPC.ObserverNode<BrowserWindowServiceObserver>): Promise<RPC.Subscription> {}
}

@service('browser-window')
export class BrowserWindowServiceObserver extends ServiceBase implements RPC.Interface<BrowserWindowServiceObserver> {
  // @ts-ignore
  onFocus(): void {}
  // @ts-ignore
  onBlur(): void {}
  // @ts-ignore
  onShow(): void {}
  // @ts-ignore
  onBeforeUnload(): void {}
  // @ts-ignore
  onDidFinishLoad(): void {}
  // @ts-ignore
  onReadyToShow(): void {}
  // @ts-ignore
  onSwipe(direction: 'up' | 'right' | 'down' | 'left') :void {}
  // @ts-ignore
  onClosed(): void {}
  // @ts-ignore
  onEnterFullScreen(): void {}
  // @ts-ignore
  onLeaveFullScreen(): void {}
  // @ts-ignore
  onContextMenu(params: Electron.ContextMenuParams): void {}
  // @ts-ignore
  onNewNotification(notificationId: string, props: NotificationProps): void {}
}

// Represents `Electron.BrowserWindow` static methods
@service('browser-window')
export class BrowserWindowManagerService extends ServiceBase implements RPC.Interface<BrowserWindowManagerService> {
  // @ts-ignore
  create(options: BrowserWindowServiceConstructorOptions): Promise<RPC.Node<BrowserWindowService>> {}
  // @ts-ignore
  getFocusedWindow(): Promise<RPC.Node<BrowserWindowService> | null> {}
  // @ts-ignore
  fromId(webContentsId: number): Promise<RPC.Node<BrowserWindowService>> {}
  // @ts-ignore
  fromWebContentsId(webContentsId: number): Promise<RPC.Node<BrowserWindowService>> {}
  // @ts-ignore
  focus(browserWindowId: number): Promise<void> {}
  // @ts-ignore
  toggleWorkerDevTools(): Promise<void> {}
}
