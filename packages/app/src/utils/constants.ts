import ms = require('ms');

// Keep only 7 active web content tabs (ignoring `alwaysLoaded` ones)
export const STATION_MAX_ACTIVE_TABS = process.env.STATION_MAX_ACTIVE_TABS ?
  parseInt(process.env.STATION_MAX_ACTIVE_TABS, 10) : 7;

// Check inactive tabs every 5 minutes
export const STATION_CHECK_INACTIVE_TAB_EVERY_MS = process.env.STATION_CHECK_INACTIVE_TAB_EVERY_MS ?
  parseInt(process.env.STATION_CHECK_INACTIVE_TAB_EVERY_MS, 10) : ms('5min');
