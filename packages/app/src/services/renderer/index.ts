import { ipcRenderer } from 'electron';
import { ElectronIpcRendererDuplex } from '../../utils/stream-ipc-proxy';
import rpcchannel, { RPCChannel } from 'stream-json-rpc';

import { isPackaged } from '../../utils/env';
import { servicesDuplexNamespace } from '../api/const';
import { ServicePeerHandler } from '../lib/class';
import { getNode } from '../lib/getNode';
import { ApolloLinkService } from '../services/apollo-link/interface';
import { AutoUpdaterService } from '../services/auto-updater/interface';
import { AutolaunchService } from '../services/autolaunch/interface';
import { BrowserWindowManagerService } from '../services/browser-window/interface';
import { CursorService } from '../services/cursor/interface';
import { DownloadService } from '../services/download/interface';
import { ChromeExtensionsService } from '../services/ecx/interface';
import { ElectronAppService } from '../services/electron-app/interface';
import { AuthenticationService } from '../services/authentication/interface';
import { ElectronGoogleOAuthService } from '../services/electron-google-oauth/interface';
import { ExtendedAppMetricsService } from '../services/extendedAppMetrics/interface';
import { ManifestService } from '../services/manifest/interface';
import { ContextMenuServiceManager, MenuService } from '../services/menu/interface';
import { OSNotificationService } from '../services/os-notification/interface';
import { ProcessManagerService } from '../services/process-manager/interface';
import { SDKIPCBroadcastService } from '../services/sdkipc/interface';
import { SDKv2Service } from '../services/sdkv2/interface';
import { SessionService } from '../services/session/interface';
import { TabWebContentsService } from '../services/tab-webcontents/interface';
import { URLRouterHelperService } from '../services/url-router-helper/interface';
import { GlobalServices, ServicesInitializerNode } from '../types';

export const getMainPeerHandler = () => {
  const duplex = new ElectronIpcRendererDuplex(0, servicesDuplexNamespace);
  const channel: RPCChannel = rpcchannel(duplex, {
    forwardErrors: true, // !isPackaged,
  });
  return new ServicePeerHandler(channel, !isPackaged);
};

export const getWorkerPeerHandler = () => {
  const workerWebContentsId = ipcRenderer.sendSync('get-worker-contents-id-sync');
  const duplex = new ElectronIpcRendererDuplex(workerWebContentsId, servicesDuplexNamespace);
  const channel: RPCChannel = rpcchannel(duplex, {
    forwardErrors: true, // !isPackaged,
  });
  return new ServicePeerHandler(channel, !isPackaged);
};

const initRenderer = (serviceClass: new (...args: any[]) => any, id: string) => (srvcPeerHandler: ServicePeerHandler) => {
  const node = new (getNode(serviceClass))(id);
  srvcPeerHandler.connect(node);
  return node;
};

export const mainServices: ServicesInitializerNode<GlobalServices> = {
  menu: initRenderer(MenuService, '__default__'),
  contextMenu: initRenderer(ContextMenuServiceManager, '__default__'),
  osNotification: initRenderer(OSNotificationService, '__default__'),
  urlRouterHelper: initRenderer(URLRouterHelperService, '__default__'),
  cursor: initRenderer(CursorService, '__default__'),
  processManager: initRenderer(ProcessManagerService, '__default__'),
  download: initRenderer(DownloadService, '__default__'),
  extendedAppMetrics: initRenderer(ExtendedAppMetricsService, '__default__'),
  autoUpdater: initRenderer(AutoUpdaterService, '__default__'),
  electronGoogleOAuth: initRenderer(ElectronGoogleOAuthService, '__default__'),
  authentication: initRenderer(AuthenticationService, '__default__'),
  browserWindow: initRenderer(BrowserWindowManagerService, '__default__'),
  defaultSession: initRenderer(SessionService, '__default__'),
  electronApp: initRenderer(ElectronAppService, '__default__'),
  ecx: initRenderer(ChromeExtensionsService, '__default__'),
  tabWebContents: initRenderer(TabWebContentsService, '__default__'),
  sdkipc: initRenderer(SDKIPCBroadcastService, '__default__'),
  autolaunch: initRenderer(AutolaunchService, '__default__'),
};

export const workerServices: ServicesInitializerNode<GlobalServices> = {
  apolloLink: initRenderer(ApolloLinkService, '__default__'),
  sdkv2: initRenderer(SDKv2Service, '__default__'),
  manifest: initRenderer(ManifestService, '__default__'),
};
