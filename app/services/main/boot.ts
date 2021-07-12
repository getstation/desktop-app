/* tslint:disable:no-import-side-effect */

/*
** This file purpose is to handle startup side effects in main process
*/

import { startSessionsListening } from '../api/sessions';

export default () => {
  startSessionsListening();
};
