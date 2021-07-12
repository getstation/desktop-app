const { app, BrowserWindow } = require('electron');
const path = require('path');

global.sharedObject = {
  mmds: process.argv.filter(x => x.endsWith('.mmd'))
};

app.whenReady().then(() => {
  const bw = new BrowserWindow({
    nodeIntegration: true,
    show: false,
  });
  const url = path.resolve(__dirname, 'cli.html');
  bw.loadURL(`file://${url}`);
});
