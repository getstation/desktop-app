/* tslint:disable:no-import-side-effect */

/*
** This file purpose is to handle startup side effects in main process
*/
import { initialize } from 'stream-electron-ipc';
import { app, ipcMain } from 'electron';

import { startSessionsListening } from '../api/sessions';

export default () => {
  initialize();
  startSessionsListening();

  ipcMain.on('get-is-packaged', (event) => {
    event.returnValue = app.isPackaged;
  });
  
};
