import ms = require('ms');

const defaultBackendSyncDelay = '1minute';
export const STATION_BACKEND_SYNC_INTERVAL_DELAY = process.env.STATION_BACKEND_SYNC_INTERVAL_DELAY ?
  ms(process.env.STATION_BACKEND_SYNC_INTERVAL_DELAY) : ms(defaultBackendSyncDelay);
