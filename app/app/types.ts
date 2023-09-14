import { RecursiveImmutableMap } from '../types';

export type StationApp = {
  appName: string,
  appVersion: string,
  includesBetaInUpdates: boolean,
  autoLaunchEnabled: boolean,
  hideMainMenu: boolean,
  isFullScreen: boolean,
  defaultDownloadFolder: string,
  downloadFolder: string,
  promptDownload: boolean,
  focus: number,
  isLoggedIn: boolean,
  isOnline: boolean,
  keyboardLayout: string,
  loadingScreenVisible: boolean,
  showLogin: boolean,
  isKbdShortcutsOverlayVisible: boolean,
};

export type StationAppImmutable = RecursiveImmutableMap<StationApp>;
