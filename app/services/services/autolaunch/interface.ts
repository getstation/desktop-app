import { ServiceBase } from '../../lib/class';
import { service } from '../../lib/decorator';
import { RPC } from '../../lib/types';

@service('autolaunch')
export class AutolaunchProviderService extends ServiceBase implements RPC.Interface<AutolaunchProviderService> {
  // @ts-ignore
  getAppName(): Promise<string> {}
  // @ts-ignore
  setAutoLaunchEnabled(enable: boolean): Promise<void> {}
}

@service('autolaunch')
export class AutolaunchService extends ServiceBase implements RPC.Interface<AutolaunchService> {
  // @ts-ignore
  setAutolaunchProvider(provider: RPC.Node<AutolaunchProviderService>): Promise<void> {}
  // @ts-ignore
  set(enable: boolean): Promise<void> {}
}
