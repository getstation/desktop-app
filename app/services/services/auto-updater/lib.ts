import { app } from 'electron';
import readAppPackageJson from '../../../utils/readAppPackageJson';
import processUtils = require('../../../utils/process');
import { isPackaged } from '../../../utils/env';
import AutoUpdaterMock from './AutoUpdaterMock';

const { isLinux, fullPlatform } = processUtils;
/**
 * Will return the feed URL to be used by the `autoAupdater`.
 *
 * Note: there is option to include beta cahnnels, but it's not used as of today.
 * @param includeBetas If true, will include beta channel
 */
export function feedURL(includeBetas: boolean = false) {
  const appName = app.name;
  if (appName === 'Station Next') return;

  let protocol = 'https';
  const packageJson = readAppPackageJson();
  let serverHost = packageJson.updateServerHost;
  if (process.env.OVERRIDE_UPDATE_SERVER_HOST) {
    serverHost = process.env.OVERRIDE_UPDATE_SERVER_HOST;
    // if we override serverHost it's probabaly we want
    // to hit localhost, so let's assume it's http
    protocol = 'http';
  }

  if (isLinux) {
    // electron-updater package doesn't use feedURL is the same way as official autoUpdater.
    // It needs to download a yml file for the latest available version
    // and it appends the yml filename to this feedURL.
    // We leverage nuts server here that will use the last version when we do not specify any.
    return `${protocol}://${serverHost}/download`;
  }

  const version = app.getVersion();
  const channel = includeBetas ? 'beta' : 'stable';
  return `${protocol}://${serverHost}/update/channel/${channel}/${fullPlatform}/${version}`;
}

function getAutoUpdaterForOS(platform: string) {
  const appName = app.name;
  if (appName === 'Station Next') return require('electron-updater').autoUpdater;
  return platform === 'linux' ? require('electron-updater').autoUpdater : require('electron').autoUpdater;
}

export const autoUpdater = !isPackaged ?
  new AutoUpdaterMock() :
  getAutoUpdaterForOS(process.platform);
