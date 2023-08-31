import { Observable } from 'rxjs';
import { ApplicationConfigData } from '../applications/duck';
import { MinimalApplication } from '../applications/graphql/withApplications';
import { BxAppManifest } from '../applications/manifest-provider/bxAppManifest';
import { PopularApps } from '../../manifests';
import { AuthProviders } from '../user-identities/types';

type AppManifest = Omit<BxAppManifest, 'icons'> & { id: string, icon: string };

type AnalyticsIdentity = {
  userId: string,
  traits: {
    email: string,
    name: string,
    firstName: string,
    lastName: string,
  },
};

type ServiceAndCorrespondingApplications = {
  applications: {
    activeTab: string,
    applicationId: string,
    computedInstanceLabel?: string,
  }[],
  serviceId: string,
  captiveURLScheme: RegExp,
  category: string,
  iconColor: string,
  iconId: string,
  id: string,
  name: string,
  noDockIcon?: boolean,
  signin_url: string,
};

export type PrivateApplicationRequest = {
  name: string,
  themeColor: string,
  bxIconURL: string,
  startURL: string,
  scope: string,
};

declare module BxAPI {

  class AuthorizationError extends Error {}
  class NoMethodError extends Error {}
  class SystemError extends Error {}
  type Error = AuthorizationError | NoMethodError | SystemError;

  type ObservableResponse<T> = Observable<T>;
  type ActionResponse<T> = Promise<T>;

  /* private */
  class Runtime {
    static observe<T>(channel: string): ObservableResponse<T>;
    static perform<T>(channel: string, payload?: any): ActionResponse<T>;
    static appIsReady(): Promise<void>;
    static onBeforeUnload(): void;
  }

  /**
   * User
   * @since 1.11.0
   */
  interface User {
    /**
     * id
     * @since 1.11.0
     */
    id: ObservableResponse<string>,
    /**
     * firstName
     * @since 1.11.0
     */
    firstName: ObservableResponse<string>,
    /**
     * identity
     * @since 1.11.0
     */
    identity: ObservableResponse<AnalyticsIdentity>,
  }

  /**
   * Theme
   * @since 1.11.0
   */
  interface Theme {
    /**
     * themeColors
     * @since 1.11.0
     */
    themeColors: ObservableResponse<string[]>,
  }

  /**
   * NotificationCenter
   * @since 1.12.0
   */
  interface NotificationCenter {
    /**
     * snoozeDurationInMs
     * @since 1.12.0
     */
    snoozeDurationInMs: ObservableResponse<string | undefined>,
  }

  /**
   * Services
   * @since 1.11.0
   */
  interface Services {
    /**
     * installByServiceId
     * @since 1.11.0
     */
    installByServiceId: (serviceId: string) => ActionResponse<void>,
    /**
     * installedServicesIds
     * @since 1.11.0
     */
    installedServicesIds: ObservableResponse<string[]>
    /**
     * servicesAndCorrespondingApplications
     * @since 1.11.0
     */
    servicesAndCorrespondingApplications: ObservableResponse<ServiceAndCorrespondingApplications[]>,
    /**
     * availableServicesToInstall
     * @since 1.11.0
     */
    availableServicesToInstall: ObservableResponse<string[]>,
  }

  interface Manifest {
    getManifest(manifestURL: string): Promise<BxAppManifest>,
  }

  interface Applications {
    install(payload: any): Promise<any>,
    uninstall(applicationId: string): Promise<any>,
    uninstallByManifest(manifestURL: string): Promise<any>,
    setConfigData(applicationId: string, configData: ApplicationConfigData): Promise<any>,
    search(query: string): Promise<{ body: MinimalApplication[] }>,
    getMostPopularApps(): Promise<{ body: PopularApps }>,
    getAllCategories(): Promise<{ body: string[]}>,
    getApplicationsByCategory(): Promise<{ body: Record<string, MinimalApplication[]> }>,
    requestPrivate(payload: PrivateApplicationRequest): Promise<{body: { id: string; bxAppManifestURL: string }}>,
    getPrivateApps(): Promise<{ body: AppManifest[] }>,
  }

  interface Identities {
    $get: ObservableResponse<any>,
    requestLogin(provider: AuthProviders): Promise<any>,
  }
}

/**
 * bx
 * @since 1.11.0
 */
interface Bx {
  user: BxAPI.User,
  theme: BxAPI.Theme,
  notificationCenter: BxAPI.NotificationCenter,
  services: BxAPI.Services,
  applications: BxAPI.Applications,
  identities: BxAPI.Identities,
  // Only available on station:// tabs
  manifest: BxAPI.Manifest,
}

declare global {
  interface Window { bx: Bx; }
}
