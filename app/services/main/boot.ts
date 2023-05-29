/* tslint:disable:no-import-side-effect */

/*
** This file purpose is to handle startup side effects in main process
*/
import { initialize } from 'stream-electron-ipc';

import { startSessionsListening } from '../api/sessions';

export default () => {
  initialize();
  startSessionsListening();
};
