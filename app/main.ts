/* tslint:disable global-require, no-import-side-effect */
import './dotenv';
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import log, { LevelOption } from 'electron-log';
// @ts-ignore: no declaration file
import { format } from 'electron-log/lib/format';
import * as path from 'path';
import { handleError } from './services/api/helpers';
import bootServices from './services/main/boot';
import { BrowserWindowManagerServiceImpl } from './services/services/browser-window/manager';
import services from './services/servicesManager';
import { getUrlToLoad } from './utils/dev';
import { isPackaged } from './utils/env';
import * as remoteMain from '@electron/remote/main';

bootServices(); // all side effects related to services (in main process)

remoteMain.initialize();

const loadWorker = () => {
  const worker = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: false,
      /**
       * See {@link GenericWindowManager} for details
       */
      webSecurity: false,
      allowRunningInsecureContent: false,
      contextIsolation: false,
    },
    width: 0,
    height: 0,
    show: false,
  });

  remoteMain.enable(worker.webContents);

  // Used by other renderers
  (global as any).worker = Object.freeze({
    webContentsId: worker.webContents.id,
  });

  ipcMain.handle('get-worker-contents-id', () => {
    return worker.webContents.id;
  });
  ipcMain.on('get-worker-contents-id-sync', (event) => {
    event.returnValue = worker.webContents.id;
  });
  
  (services.browserWindow as BrowserWindowManagerServiceImpl)
    .setWorkerBrowserWindow(worker)
    .catch(handleError());

  worker.loadURL(getUrlToLoad('index.html'));

  if (!isPackaged) {
    worker.webContents.openDevTools({
      mode: 'detach',
    });
  }

  return worker;
};

const loadCliWindow = async (command: string) => {
  await app.whenReady();
  const bw = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: false,
      contextIsolation: false,
    },
    width: 0,
    height: 0,
    show: false,
  });
  remoteMain.enable(bw.webContents);

  await bw.loadURL(getUrlToLoad('cli.html'));

  switch (command) {
    case 'database':
      const index = process.argv.indexOf('database');
      const args = process.argv.slice(index + 1);
      bw.webContents.send('command', 'database', ...args);
      break;
  }
};

const initWorker = () => {
  app.on('ready', () => {

    loadWorker();

    if (module.hot) {
      ipcMain.on('hmr:worker', () => {
        // https://github.com/electron-userland/electron-webpack/blob/5ad2481e1b90f3c290d4fa63879b9620f88887de/packages/electron-webpack/src/electron-main-hmr/HmrClient.ts#L78
        app.exit(100);
      });
    }
  });
};

/**
 * override userData if needed
 */
const overrideUserDataPath = () => {
  if (process.env.OVERRIDE_USER_DATA_PATH) {
    const userDataPath = path.join(app.getPath('appData'), process.env.OVERRIDE_USER_DATA_PATH);
    app.setPath('userData', userDataPath);
  } else if (!isPackaged) {
    app.name = 'Station Dev';
    const userDataPath = path.join(app.getPath('appData'), 'Station Dev');
    app.setPath('userData', userDataPath);
  } else {
    // do not conflict with pre open-source data
    const userDataPath = path.join(app.getPath('appData'), 'Stationv2');
    app.setPath('userData', userDataPath);
  }
};

const applyLogLevel = () => {
  let logLevel: LevelOption = 'info';
  if (!isPackaged) {
    logLevel = 'debug';
  }
  if (process.env.LOG_LEVEL) {
    logLevel = (process.env.LOG_LEVEL as LevelOption);
  }

  log.transports.file.level = logLevel;
  log.transports.console.level = logLevel;
  // When electron started with --inspect, `console.debug` gets defined
  // but outputs nothing => electron-log uses it and we don't see logs
  // https://github.com/electron/electron/issues/10260
  // https://github.com/megahertz/electron-log/issues/44
  log.transports.console = Object.assign((msg: any) => {
    // eslint-disable-next-line no-console
    console.log(format(msg, log.transports.console.format));
  }, log.transports.console);
};

const installDevToolsExtensions = async () => {
//  const ECx = require('electron-chrome-extension').default;

  // REACT_DEVELOPER_TOOLS
//  await ECx.load('fmkadmapgofadopljbjfkapdkoienihi');

  // Apollo Client Developer Tools
//  await ECx.load('jdkknkkbebbapilgoeccciglkfbmbnfm');

  // TODO: not working as it
  // Redux DevTools
  // await ECx.load('lmhkpmbekcpmknklioeibfkpmmfibljd');
};

const lazyBxAppMain = () => {
  // require `app-main` lazily so that configurations overriden below
  // are taken into account
  const BrowserXAppMain = require('./app-main').default;

  return new BrowserXAppMain();
};

const init = () => {

  app.commandLine.appendSwitch('allow-insecure-localhost');

  overrideUserDataPath();
  applyLogLevel();

  if (process.argv.indexOf('database') !== -1) {
    loadCliWindow('database').catch(console.error);
    return;
  }

  initWorker();

  if (isPackaged) {
    if (process.env.WEBPACK_DEVTOOL) {
      const sourceMapSupport = require('source-map-support');
      sourceMapSupport.install();
    }
  } else {
    require('electron-debug')();
  }

  const bxAppMain = lazyBxAppMain();

  if (!isPackaged && !process.env.STATION_DISABLE_ECX) {
    app.on('session-created', s => {
      s.setPreloads([path.resolve(__dirname, 'static/preload/dev-preload.js')]);
    });
    bxAppMain.onOpen = installDevToolsExtensions;
  }

  // let's go baby
  bxAppMain.init();
};

if (!isPackaged) {
  process.on('unhandledRejection', error => {
    console.error(error);
  });

  // in dev, put back electron's default behavior with uncaught exceptions
  process.on('uncaughtException', error => {
    const stack = error.stack ? error.stack : `${error.name}: ${error.message}`;
    const message = 'Uncaught Exception:\n' + stack;
    dialog.showErrorBox('A JavaScript error occurred in the main process', message);
  });
} else {
  process.on('unhandledRejection', error => {
    console.error(error);
  });

  process.on('uncaughtException', error => {
    console.error(error);
  });
}

if (module.hot) {
  module.hot.accept();
}

init();
