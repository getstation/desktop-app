import { ServiceBase } from '../../lib/class';
import { service } from '../../lib/decorator';
import { RPC } from '../../lib/types';
import { ElectronAppPath } from './types';

@service('electron-app')
export class ElectronAppService extends ServiceBase implements RPC.Interface<ElectronAppService> {
  // @ts-ignore
  getPath(name: ElectronAppPath): Promise<string> {}
  // @ts-ignore
  quit(): Promise<void> {}
  // @ts-ignore
  canResumeQuit(): Promise<void> {}
  // @ts-ignore
  resumeQuit(): Promise<void> {}
  // @ts-ignore
  isReady(): Promise<boolean> {}
  // Can't directly call `whenReady` because it is part of ServiceBase (and only available in implementation),
  // so we create an `afterReady` which calls `whenReady`
  // @ts-ignore
  afterReady(): Promise<void> {}
  // @ts-ignore
  getVersion(): Promise<string> {}
  // @ts-ignore
  dockSetBadge(badge: string): Promise<void> {}
  // @ts-ignore
  getAppMetadata(): Promise<AppMetadata> {}
  // @ts-ignore
  showTrayIcon(): Promise<void> {}
  // @ts-ignore
  hideTrayIcon(): Promise<void> {}
  // @ts-ignore
  addObserver(obs: RPC.ObserverNode<ElectronAppServiceObserver>): Promise<RPC.Subscription> {}
  // @ts-ignore
  setProvider(provider: RPC.Node<ElectronAppServiceProviderService>): Promise<void> {}
}

@service('electron-app')
export class ElectronAppServiceObserver extends ServiceBase implements RPC.Interface<ElectronAppServiceObserver> {
  onActivate(): void {}
  onBeforeQuit(): void {}
  onPrepareQuit(): void {}
}

export interface AppMetadata {
  name: string,
  version: string,
}

@service('browser-window')
export class ElectronAppServiceProviderService extends ServiceBase implements RPC.Interface<ElectronAppServiceProviderService> {
  // @ts-ignore
  showTrayIcon(): Promise<void> {}
  // @ts-ignore
  hideTrayIcon(): Promise<void> {}
}
