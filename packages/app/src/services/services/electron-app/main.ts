import * as path from 'path';
import { BrowserWindow, Menu, Tray, app, nativeImage, session } from 'electron';
import log from 'electron-log';
import * as globalTunnel from 'global-tunnel-ng';
import { fromEvent, Subject, Subscription } from 'rxjs';

import { isPackaged } from '../../../utils/env';
import { ServiceSubscription } from '../../lib/class';
import { RPC } from '../../lib/types';
import { ElectronAppService, ElectronAppServiceObserver, ElectronAppServiceProviderService } from './interface';
import { ElectronAppPath } from './types';

const RESUME_QUIT_RECOVERY_DELAY = 5000;

function initProxyResolver() {
  app.on('ready', () => {
    const defaultSession = session.defaultSession!;

    // Use electron session resolver to detect proxy settings with a distant URL
    // If settings are detected, parse them then intialize a global tunnel for the whole app
    defaultSession.resolveProxy('https://auth0.com/', (proxyDetected) => {
      if (proxyDetected === 'DIRECT') {
        log.info('Proxy : no settings detected');
      } else {
        log.info('Proxy : settings detected ', proxyDetected);
        // Parse the answer, it looks like : PROXY 192.168.11.124:9976
        const proxySettings = proxyDetected.split(' ')[1].split(':');
        globalTunnel.initialize({
          host: proxySettings[0],
          port: Number(proxySettings[1]),
        });
      }
    });
  });
}

export class ElectronAppServiceImpl extends ElectronAppService implements RPC.Interface<ElectronAppService> {
  private prepareQuitSubject: Subject<void>;
  private appCanQuit: boolean;
  private provider?: RPC.Node<ElectronAppServiceProviderService>;
  private tray?: Tray;

  constructor(uuid?: string) {
    super(uuid, { ready: false });

    this.appCanQuit = false;
    this.prepareQuitSubject = new Subject<void>();
    this.init();
  }

  async afterReady() {
    await this.whenReady();
  }

  async isReady() {
    return app.isReady();
  }

  async getVersion() {
    return app.getVersion();
  }

  async init() {
    this.initPrepareQuit();
    initProxyResolver();

    app.whenReady().then(() => this.ready());
  }

  async getPath(name: ElectronAppPath) {
    return app.getPath(name);
  }

  async quit() {
    // Trigger 'prepare-quit' observers
    this.prepareQuitSubject.next();

    // Automatically resume quit after a while, if ever a problem occurred
    setTimeout(
      this.resumeQuit.bind(this),
      RESUME_QUIT_RECOVERY_DELAY,
    );
  }

  async canResumeQuit() {
    this.appCanQuit = true;
  }

  async resumeQuit() {
    await this.canResumeQuit();
    log.info('Quitting');
    app.quit();
  }

  async dockSetBadge(badge: string) {
    app.dock.setBadge(badge);
  }

  async getAppMetadata() {
    return {
      name: app.name,
      version: app.getVersion(),
    };
  }

  async addObserver(obs: RPC.ObserverNode<ElectronAppServiceObserver>) {
    const subscriptions: Subscription[] = [];

    if (obs.onActivate) {
      subscriptions.push(fromEvent(app, 'activate')
        .subscribe(() => {
          obs.onActivate!();
        })
      );
    }

    if (obs.onBeforeQuit) {
      subscriptions.push(fromEvent(app, 'before-quit')
        .subscribe(() => {
          obs.onBeforeQuit!();
        })
      );
    }

    if (obs.onPrepareQuit) {
      subscriptions.push(this.prepareQuitSubject.asObservable()
        .subscribe(() => {
          obs.onPrepareQuit!();
        })
      );
    }

    return new ServiceSubscription(subscriptions, obs);
  }

  async showTrayIcon() {
    if (!this.provider) {
      throw new Error('missing provider service');
    }
    this.tray = this.createTray();
    await this.provider.showTrayIcon();
  }

  async hideTrayIcon() {
    if (!this.provider) {
      throw new Error('missing provider service');
    }
    if (this.tray) {
      this.tray.destroy();
      this.tray = undefined;
    }
    await this.provider.hideTrayIcon();
  }

  private initPrepareQuit() {
    app.on('before-quit', (event) => {
      if (!this.appCanQuit) {
        event.preventDefault();
        // Trigger 'prepare-quit' observers
        this.prepareQuitSubject.next();
      }
    });
  }

  async setProvider(provider: RPC.Node<ElectronAppServiceProviderService>) {
    this.provider = provider;
  }

  private getTrayIcon() {
    const result = nativeImage.createFromPath(
      isPackaged 
        ? path.resolve(process.resourcesPath, 'icon-app.png')
        : path.resolve(__dirname, '../../../static/icon-app.png')
    );
    result.setTemplateImage(true);

    return result;
  }

  private showAllWindows() {
    BrowserWindow.getAllWindows()
      .reverse()
      .forEach(win => {
        if (win.webContents.id !== 1) {
          win.show();
        }
      });
  }

  private createTray() {
    const contextMenu = Menu.buildFromTemplate([
      { 
        label: 'Open',
        type: 'normal',
        click: () => { 
          this.showAllWindows();
        },
      },
      { 
        label: 'Exit', 
        type: 'normal',
        click: () => { 
          app.quit() 
        } 
      },
    ]);

    const tray = new Tray(this.getTrayIcon());
    tray.addListener('double-click', () => this.showAllWindows());
    tray.setToolTip('Station');
    tray.setContextMenu(contextMenu);
    return tray;
  }
}
