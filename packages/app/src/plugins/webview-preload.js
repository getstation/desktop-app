  const { contextBridge, ipcRenderer } = require('electron');
  const { Observable } = require('rxjs');

  const sendPerformToProxy = (channel, payload) => {
    const p = new Promise(resolve => {
      ipcRenderer.once(`bx-api-perform-response-${channel}`, (_, result) => {
        resolve(result);
      });
    });
    setTimeout(() => {
      ipcRenderer.invoke('get-worker-contents-id')
          .then(workerWebContentsId => ipcRenderer.sendTo(workerWebContentsId, 'bx-api-perform', channel, payload));
    }, 1);
    return p;
  };

  const addListenerToChannel = (channel, listener) => {
    ipcRenderer.on(`bx-api-subscribe-response-${channel}`, listener);
    setTimeout(() => {
      ipcRenderer.invoke('get-worker-contents-id')
          .then(workerWebContentsId => ipcRenderer.sendTo(workerWebContentsId, 'bx-api-subscribe', channel));
    }, 1);
  };

  class BxAPI {
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

  const bxApi = {
    notificationCenter: {
        addSnoozeDurationInMsChangeListener: (listener) => addListenerToChannel('GetSnoozeDuration', listener),

        sendNotification: (id, notification) => ipcRenderer.send('new-notification', id, notification),
        closeNotification: (id) => ipcRenderer.send('notification-close', id),

        addNotificationClickListener: (listener) => ipcRenderer.on('trigger-notification-click', listener),
        removeNotificationClickListener: (listener) => ipcRenderer.removeListener('trigger-notification-click', listener),
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
      addThemeColorsChangeListener: (listener) => addListenerToChannel('GetThemeColors', listener),
    },
    identities: {
      addIdentitiesChangeListener: (listener) => addListenerToChannel('GetAllIdentities', listener),

      requestLogin: (provider) => BxAPI.perform(
        'RequestLogin',
        { provider },
        ['provider']
      ),
    },
     manifest: {
      getManifest: (manifestURL) => BxAPI.perform(
        'GetManifestByURL', 
        { manifestURL }, 
        ['manifestURL']
      ),
     }
    };

//  if (!window.location.href.startsWith('station://appstore')) {
    contextBridge.exposeInMainWorld('bx', bxApi);

    console.log('>>>> contextBridge done')
  // }
  // else {
  //   window.bx = bxApi;

  //   console.log('>>>> bx done')
  // }
