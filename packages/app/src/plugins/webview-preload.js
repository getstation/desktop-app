const { contextBridge, ipcRenderer } = require('electron');
const { Observable } = require('rxjs');

const sendPerformToProxy = (channel, payload) => {
  const p = new Promise(resolve => {
    ipcRenderer.once(`bx-api-perform-response-${channel}`, (_event, wrapper, result) => {
      // If result is undefined, it means wrapper was actually the result (not proxied)
      // or wrapper is the __senderId wrapper from our main process proxy.
      if (wrapper && typeof wrapper === 'object' && typeof wrapper.__senderId === 'number') {
        resolve(result);
      } else {
        resolve(wrapper);
      }
    });
  });
  // Send to main process which proxies to worker (replacing deprecated ipcRenderer.sendTo)
  ipcRenderer.send('bx-api-perform', channel, payload);
  return p;
};

const wrappers = new Map();

const addListenerToChannel = (channel, listener) => {
  const wrapperListener = (_event, wrapper, result) => {
    if (wrapper && typeof wrapper === 'object' && typeof wrapper.__senderId === 'number') {
      listener(result);
    } else {
      listener(wrapper);
    }
  };
  wrappers.set(listener, wrapperListener);
  ipcRenderer.on(`bx-api-subscribe-response-${channel}`, wrapperListener);
  // Send to main process which proxies to worker
  ipcRenderer.send('bx-api-subscribe', channel);
};

const removeListenerToChannel = (channel, listener) => {
  const wrapperListener = wrappers.get(listener);
  if (wrapperListener) {
    ipcRenderer.off(`bx-api-subscribe-response-${channel}`, wrapperListener);
    wrappers.delete(listener);
  }
}

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
    removeNotificationClickListener: (listener) => ipcRenderer.off('trigger-notification-click', listener),
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
    removeIdentitiesChangeListener: (listener) => removeListenerToChannel('GetAllIdentities', listener),

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

contextBridge.exposeInMainWorld('bxApi', bxApi);

console.log('>>>> contextBridge done')
