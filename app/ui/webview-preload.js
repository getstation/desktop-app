const ipc = require('electron').ipcRenderer;

document.addEventListener('DOMContentLoaded', () => {
  ipc.on('ui-setCursorIcon', (event, cursor) =>
    document.querySelector('html').style.cursor = `${cursor}`);
});
