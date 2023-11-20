import { ServicePeerHandler } from './lib/class';
import { ApolloLinkService } from './services/apollo-link/interface';
import { AutoUpdaterService } from './services/auto-updater/interface';
import { AutolaunchService } from './services/autolaunch/interface';
import { BrowserWindowManagerService } from './services/browser-window/interface';
import { CursorService } from './services/cursor/interface';
import { DownloadService } from './services/download/interface';
import { ChromeExtensionsService } from './services/ecx/interface';
import { ElectronAppService } from './services/electron-app/interface';
import { AuthenticationService } from './services/authentication/interface';
import { ElectronGoogleOAuthService } from './services/electron-google-oauth/interface';
import { ExtendedAppMetricsService } from './services/extendedAppMetrics/interface';
import { ManifestService } from './services/manifest/interface';
import { ContextMenuServiceManager, MenuService } from './services/menu/interface';
import { OSNotificationService } from './services/os-notification/interface';
import { ProcessManagerService } from './services/process-manager/interface';
import { SDKIPCBroadcastService } from './services/sdkipc/interface';
import { SDKv2Service } from './services/sdkv2/interface';
import { SessionService } from './services/session/interface';
import { TabWebContentsService } from './services/tab-webcontents/interface';
import { URLRouterHelperService } from './services/url-router-helper/interface';

export type GlobalServices = {
  menu: MenuService,
  contextMenu: ContextMenuServiceManager,
  osNotification: OSNotificationService,
  urlRouterHelper: URLRouterHelperService,
  cursor: CursorService,
  processManager: ProcessManagerService,
  download: DownloadService,
  extendedAppMetrics: ExtendedAppMetricsService,
  autoUpdater: AutoUpdaterService,
  electronGoogleOAuth: ElectronGoogleOAuthService,
  authentication: AuthenticationService,
  browserWindow: BrowserWindowManagerService,
  defaultSession: SessionService,
  electronApp: ElectronAppService,
  ecx: ChromeExtensionsService,
  apolloLink: ApolloLinkService,
  tabWebContents: TabWebContentsService,
  sdkipc: SDKIPCBroadcastService,
  sdkv2: SDKv2Service,
  autolaunch: AutolaunchService,
  manifest: ManifestService,
};

export type ServicesInitializerNode<T> = {
  [key in Extract<keyof T, string>]?: (srvcp: ServicePeerHandler) => T[key];
};

export type ServicesInitializerImpl<T> = {
  [key in Extract<keyof T, string>]?: () => T[key];
};
