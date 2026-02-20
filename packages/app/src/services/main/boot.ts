
/*
** This file purpose is to handle startup side effects in main process
*/
import { app, ipcMain } from 'electron';

import { startSessionsListening } from '../api/sessions';

export default () => {

  // make sure that `stream-electron-ipc` side-effect is called early
  require('../../utils/stream-ipc-proxy');

  startSessionsListening();

  ipcMain.on('get-is-packaged', (event) => {
    event.returnValue = app.isPackaged;
  });

};
