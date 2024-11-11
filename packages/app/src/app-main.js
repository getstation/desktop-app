import * as path from 'path';
import { EventEmitter } from 'events';
import { parse } from 'url';
import { app, webContents, BrowserWindow, Menu, Tray } from 'electron';
import log from 'electron-log';

import { isWindows } from './utils/process';
import { isPackaged } from './utils/env';
import services from './services/servicesManager';
import { observer } from './services/lib/helpers';
import { handleError } from './services/api/helpers';
import { start } from './webui/webUIHandler';
import { enhanceSession } from './session';

export default class BrowserXAppMain extends EventEmitter {
  
  init() {
    this.initAppLifeCycle();
    this.initProcessManagerAnalytics().catch(handleError());
    this.initWebUIHandler();
  }

  initAppLifeCycle() {
    app.on('ready', async () => {
      // can register a onOpen function that should return a promise
      if (typeof this.onOpen === 'function') {
        await this.onOpen();
      }
    });
    app.on('session-created', (session) => {
      enhanceSession(session);
    })
  }

  // eslint-disable-next-line class-methods-use-this
  async initProcessManagerAnalytics() {
    const onWillKillProcess = ({ pid }) => {
      const wc = webContents.getAllWebContents().find(w => w.getOSProcessId() === pid);
      if (!wc) return;

      const url = parse(wc.getURL());

      log.info('Will kill process', pid, url.host);
    };
    return services.processManager.addObserver(observer({ onWillKillProcess }));
  }

  getTrayIcon() {
    let result = undefined;

    if (isWindows) {
      result = isPackaged 
        ? path.resolve(process.resourcesPath, 'icon.ico')
        : path.resolve(__dirname, '../build/icon.ico');
    }
    else {
      result = isPackaged 
        ? path.resolve(process.resourcesPath, 'icon.png')
        : path.resolve(__dirname, '../build/icon_512x512.png');
    }

    return result;
  }

  initWebUIHandler() {
    const trayIcon = this.getTrayIcon();
    app.on('ready', () => {
      start();

      const tray = new Tray(trayIcon);
      const contextMenu = Menu.buildFromTemplate([
        { 
          label: 'Open',
          type: 'normal',
          click: () => { 
            BrowserWindow.getAllWindows()
              .reverse()
              .forEach(win => {
                win.show();
              });
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
      tray.setToolTip('Station');
      tray.setContextMenu(contextMenu);
    });
  }
}
