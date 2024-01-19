import { EventEmitter } from 'events';
import { parse } from 'url';
import { app, session, webContents } from 'electron';
import log from 'electron-log';
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

  initWebUIHandler() {
    app.on('ready', () => {
      start();
    });
  }
}
