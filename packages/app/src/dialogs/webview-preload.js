const ipc = require('electron').ipcRenderer;
const RecursiveOverride = require('../utils/webview-override-helper');

function overrideAlerts(windowObject) {
  windowObject.alert = (message, title = '') => {
    ipc.sendSync('window-alert', { message, title });

    // Alert should always return undefined. See https://goo.gl/gYTEwK
    return;
  };
}

RecursiveOverride(document, window, overrideAlerts);
