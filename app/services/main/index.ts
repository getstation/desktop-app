import { Duplex } from 'stream';
import rpcchannel, { RPCChannel } from 'stream-json-rpc';
import { isPackaged } from '../../utils/env';
import { ServicePeerHandler } from '../lib/class';
import { ApolloLinkService } from '../services/apollo-link/interface';
import { AutoUpdaterServiceImpl } from '../services/auto-updater/main';
import { AutolaunchServiceImpl } from '../services/autolaunch/main';
import { BrowserWindowManagerServiceImpl } from '../services/browser-window/manager';
import { CursorServiceImpl } from '../services/cursor/main';
import { DownloadServiceImpl } from '../services/download/main';
import { ChromeExtensionsService } from '../services/ecx/interface';
import { ElectronAppServiceImpl } from '../services/electron-app/main';
import { AuthenticationServiceImpl } from '../services/authentication/main';
import { ElectronGoogleOAuthServiceImpl } from '../services/electron-google-oauth/main';
import { ExtendedAppMetricsServiceImpl } from '../services/extendedAppMetrics/main';
import { ManifestService } from '../services/manifest/interface';
import { ContextMenuServiceManagerImpl, MenuServiceImpl } from '../services/menu/main';
import { OSNotificationServiceImpl } from '../services/os-notification/main';
import { ProcessManagerServiceImpl } from '../services/process-manager/main';
import { SDKIPCBroadcastServiceImpl } from '../services/sdkipc/main';
import { SDKv2Service } from '../services/sdkv2/interface';
import { SessionServiceImpl } from '../services/session/main';
import { TabWebContentsServiceImpl } from '../services/tab-webcontents/main';
import { URLRouterHelperServiceImpl } from '../services/url-router-helper/main';
import { GlobalServices, ServicesInitializerImpl, ServicesInitializerNode } from '../types';

const ChromeExtensionsServiceImpl: ChromeExtensionsService = process.env.STATION_DISABLE_ECX ?
  require('../services/ecx/dummy').ChromeExtensionsServiceDummy : require('../services/ecx/main').ChromeExtensionsServiceImpl;

export const getWorkerPeerHandler = (duplex: Duplex) => {
  const channel: RPCChannel = rpcchannel(duplex, {
    forwardErrors: true, // !isPackaged,
  });
  return new ServicePeerHandler(channel, !isPackaged);
};

const initMain = (service: any, uuid: string) => () => {
  return new service(uuid);
};

export const mainServices: ServicesInitializerImpl<GlobalServices> = {
  menu: initMain(MenuServiceImpl, '__default__'),
  contextMenu: initMain(ContextMenuServiceManagerImpl, '__default__'),
  osNotification: initMain(OSNotificationServiceImpl, '__default__'),
  urlRouterHelper: initMain(URLRouterHelperServiceImpl, '__default__'),
  cursor: initMain(CursorServiceImpl, '__default__'),
  processManager: initMain(ProcessManagerServiceImpl, '__default__'),
  download: initMain(DownloadServiceImpl, '__default__'),
  extendedAppMetrics: initMain(ExtendedAppMetricsServiceImpl, '__default__'),
  autoUpdater: initMain(AutoUpdaterServiceImpl, '__default__'),
  electronGoogleOAuth: initMain(ElectronGoogleOAuthServiceImpl, '__default__'),
  authentication: initMain(AuthenticationServiceImpl, '__default__'),
  browserWindow: initMain(BrowserWindowManagerServiceImpl, '__default__'),
  defaultSession: initMain(SessionServiceImpl, '__default__'),
  electronApp: initMain(ElectronAppServiceImpl, '__default__'),
  ecx: initMain(ChromeExtensionsServiceImpl, '__default__'),
  tabWebContents: initMain(TabWebContentsServiceImpl, '__default__'),
  sdkipc: initMain(SDKIPCBroadcastServiceImpl, '__default__'),
  autolaunch: initMain(AutolaunchServiceImpl, '__default__'),
};

export const workerServices: ServicesInitializerNode<GlobalServices> = {
  apolloLink: initMain(ApolloLinkService, '__default__'),
  sdkv2: initMain(SDKv2Service, '__default__'),
  manifest: initMain(ManifestService, '__default__'),
};
