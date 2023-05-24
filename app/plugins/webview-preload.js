/* eslint-disable global-require */
const micromatch = require('micromatch');

const originsAllowed = [
  'http://localhost:8080',
  'http://localhost:8081',
  'http://staging-apps.getstation.com',
  'https://staging-apps.getstation.com',
  'https://apps.getstation.com',
  // deploy previews of the appstore
  'https://*--station-appstore.netlify.com',

  'https://www.messenger.com',
  'https://web.whatsapp.com',
];
const protocolsAllowed = [
  'station:',
];
if (micromatch.isMatch(window.location.origin, originsAllowed) || protocolsAllowed.includes(window.location.protocol)) {
  const { ipcRenderer } = require('electron');
  const remote = require('@electron/remote');
  const { Observable } = require('rxjs/Rx');


//  require('electron-log').info(`XXXXXXXXXXXXXXXXXXXX 1 ${JSON.stringify(window.location)}`);
  //console.log(`XXXXXXXXXXXXXXXXXXXX 1 ${JSON.stringify(window.location)}`);


  const workerWebContentsId = remote.getGlobal('worker').webContentsId;


  // require('electron-log').info(`XXXXXXXXXXXXXXXXXXXX 2`);
  //console.log(`XXXXXXXXXXXXXXXXXXXX 2`);


  const sendPerformToProxy = (channel, payload) => {
    const p = new Promise(resolve => {
      ipcRenderer.once(`bx-api-perform-response-${channel}`, (_, result) => {
        resolve(result);
      });
    });
    setTimeout(() => {
      ipcRenderer.sendTo(workerWebContentsId, 'bx-api-perform', channel, payload);
    }, 1);
    return p;
  };

  const sendSubscribeToProxy = (channel) => {
    const o = new Observable(obs => {
      ipcRenderer.on(`bx-api-subscribe-response-${channel}`, (_, result) => {
        obs.next(result);
      });
    });
    setTimeout(() => {
      ipcRenderer.sendTo(workerWebContentsId, 'bx-api-subscribe', channel);
    }, 1);
    return o;
  };

  class BxAPI {
    static subscribe(channel) {
      return sendSubscribeToProxy(channel);
    }

    static async perform(channel, payload, requiredParams) {
      if (requiredParams) {
        for (const requiredParam of requiredParams) {
          if (!payload[requiredParam]) {
            throw new TypeError(`${requiredParam} value is missing`);
          }
        }
      }

      await BxAPI.appIsReady();
      return sendPerformToProxy(channel, payload);
    }

    static async appIsReady() {
      return new Promise(resolve => {
        if (document.readyState !== 'loading') {
          return resolve();
        }
        document.addEventListener('DOMContentLoaded', resolve);
      });
    }
  }

  window.bx = {
    notificationCenter: {
      snoozeDurationInMs: BxAPI.subscribe('GetSnoozeDuration'),
    },
    applications: {
      install: (payload) => BxAPI.perform(
        'InstallApplication',
        payload,
        ['manifestURL', 'context']
      ),
      uninstall: (applicationId) => BxAPI.perform(
        'UninstallApplication',
        { applicationId },
        ['applicationId']
      ),
      uninstallByManifest: (manifestURL) => BxAPI.perform(
        'UninstallApplications',
        { manifestURL },
        ['manifestURL']
      ),
      setConfigData: (applicationId, configData) => BxAPI.perform(
        'SetApplicationConfigData',
        { applicationId, configData },
        ['applicationId', 'configData']
      ),
      search: (query) => BxAPI.perform(
        'SearchApplication',
        { query },
        ['query']
      ),
      getMostPopularApps: () => BxAPI.perform('GetMostPopularApplication', {}, []),
      getAllCategories: () => BxAPI.perform('GetAllCategories', {}, []),
      getApplicationsByCategory: () => BxAPI.perform('GetApplicationsByCategory', {}, []),
      requestPrivate: (payload) => BxAPI.perform(
        'RequestPrivateApplication',
        payload,
        ['name', 'themeColor', 'bxIconURL', 'startURL', 'scope']
      ),
      getPrivateApps: () => BxAPI.perform(
        'GetPrivateApplications',
        {},
        []
      )
    },
    theme: {
      themeColors: BxAPI.subscribe('GetThemeColors'),
    },
    identities: {
      $get: BxAPI.subscribe('GetAllIdentities'),
      requestLogin: (provider) => BxAPI.perform(
        'RequestLogin',
        { provider },
        ['provider']
      ),
    },
  };
}
