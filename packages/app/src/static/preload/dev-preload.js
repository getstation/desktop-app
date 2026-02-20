if (!process.env.STATION_DISABLE_ECX) {
  // require('electron-chrome-extension/preload');
  console.warn('electron-chrome-extension disabled due to incompatibility with Electron 31');
}
