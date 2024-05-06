import { ServiceBase } from '../../lib/class';
import { service, timeout } from '../../lib/decorator';
import { RPC } from '../../lib/types';

export enum SDKv2Actions {
  InstallApplication = 'InstallApplication',
  UninstallApplication = 'UninstallApplication',
  UninstallApplications = 'UninstallApplications',
  SetApplicationConfigData = 'SetApplicationConfigData',
  RequestLogin = 'RequestLogin',
  SearchApplication = 'SearchApplication',
  GetMostPopularApplication = 'GetMostPopularApplication',
  GetAllCategories = 'GetAllCategories',
  GetApplicationsByCategory = 'GetApplicationsByCategory',
  RequestPrivateApplication = 'RequestPrivateApplication',
  GetPrivateApplications = 'GetPrivateApplications',
  GetManifestByURL = 'GetManifestByURL',
}

export enum SDKv2Selectors {
  GetSnoozeDuration = 'GetSnoozeDuration',
  GetThemeColors = 'GetThemeColors',
  GetAllIdentities = 'GetAllIdentities',
}

@service('sdkv2')
export class SDKv2Service extends ServiceBase implements RPC.Interface<SDKv2Service> {
  @timeout(0) // some action could require more time than default timeout
  // @ts-ignore
  callAction(channel: SDKv2Actions | SDKv2Selectors, payload: any): Promise<any> {}
  // @ts-ignore
  addObserver(channel: SDKv2Actions | SDKv2Selectors, obs: RPC.ObserverNode<SDKv2ServiceObserver>): Promise<RPC.Subscription> {}
}

@service('sdkv2')
export class SDKv2ServiceObserver extends ServiceBase implements RPC.Interface<SDKv2ServiceObserver> {
  // @ts-ignore
  on<T>(result: any): void {}
}
