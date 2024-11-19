import { app, BrowserWindow, shell, WebContents, HandlerDetails } from 'electron';

import { isDarwin } from '../../../utils/process';
import { RPC } from '../../lib/types';
import { BrowserWindowManagerService, BrowserWindowServiceConstructorOptions, BrowserWindowManagerProviderService } from './interface';
import { BrowserWindowServiceImpl } from './main';

const areAllWindowsClosed = () => {
  const wins = BrowserWindow.getAllWindows();
  const visibleWindowStillOpened = wins.reduce((sum, window) => sum || window.isVisible(), false);
  return !visibleWindowStillOpened;
};

const closeAppIfAllWindowsClosed = () => {
  if (isDarwin || !areAllWindowsClosed()) return;
  app.quit();
};

export class BrowserWindowManagerServiceImpl extends BrowserWindowManagerService implements RPC.Interface<BrowserWindowManagerService> {
  protected weakrefs: WeakMap<Electron.BrowserWindow, BrowserWindowServiceImpl>;
  private worker?: BrowserWindow;
  private provider?: RPC.Node<BrowserWindowManagerProviderService>;
  private autoHideMainMenu: boolean = false;

  constructor(uuid?: string) {
    super(uuid);
    this.weakrefs = new WeakMap();

    app.on('window-all-closed', closeAppIfAllWindowsClosed);

    app.on('browser-window-created', (_e, bw) => {
      bw.on('closed', closeAppIfAllWindowsClosed);
      bw.webContents.setWindowOpenHandler((details: HandlerDetails) => {
        shell.openExternal(details.url);
        return { action: 'deny' };
      });
    });
  }

  async create(options: BrowserWindowServiceConstructorOptions) {
    const windowService = new BrowserWindowServiceImpl({
      autoHideMenuBar: this.autoHideMainMenu,
      ...options
    });
    this.weakrefs.set(windowService.window, windowService);
    return windowService;
  }

  async getFocusedWindow() {
    const bw = BrowserWindow.getFocusedWindow();
    if (!bw) return bw; // no focused window
    return this.getServiceFromBrowserWindow(bw);
  }

  async fromId(browserWindowId: number) {
    const bw = BrowserWindow.fromId(browserWindowId);
    return this.getServiceFromBrowserWindow(bw);
  }

  async fromWebContentsId(webContentsId: number) {
    const wc = WebContents.fromId(webContentsId);
    const bw = BrowserWindow.fromWebContents(wc);
    return this.getServiceFromBrowserWindow(bw);
  }

  async setWorkerBrowserWindow(worker: BrowserWindow) {
    this.worker = worker;
  }

  async toggleWorkerDevTools() {
    if (!this.worker) {
      throw new Error('no worker BrowserWindow');
    }
    if (this.worker.webContents.isDevToolsOpened()) {
      this.worker.webContents.closeDevTools();
    } 
    else {
      this.worker.webContents.openDevTools({
        mode: 'detach',
      });
    }
  }

  async focus(browserWindowId: number) {
    const bw = BrowserWindow.fromId(browserWindowId);
    if (bw) {
      bw.focus();
    }
  }

  private getServiceFromBrowserWindow(bw?: Electron.BrowserWindow): BrowserWindowServiceImpl {
    if (!bw) {
      throw new Error('BrowserWindow is not defined');
    }
    const windowService = this.weakrefs.get(bw);
    if (!windowService) {
      throw new Error(`BrowserWindow ${bw.id} has not been initialized through BrowserWindowManagerService`);
    }
    return windowService;
  }

  async setProvider(provider: RPC.Node<BrowserWindowManagerProviderService>) {
    this.provider = provider;
  }

  async hideMainMenu(hide: boolean) {
    if (!this.provider) {
      throw new Error('missing menu provider service');
    }
    this.autoHideMainMenu = hide;
    BrowserWindow.getAllWindows().forEach((bw) => {
      bw.setAutoHideMenuBar(hide);
      bw.setMenuBarVisibility(!hide);
    });
    await this.provider.setHideMainMenu(hide);
  }

  async hideAllWindows() {
    BrowserWindow.getAllWindows().forEach((bw) => {
      bw.hide();
    });
  }
}
