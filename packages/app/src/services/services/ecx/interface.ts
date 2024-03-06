import { Extension } from '../../../chrome-extensions/types';
import { ServiceBase } from '../../lib/class';
import { service } from '../../lib/decorator';
import { RPC } from '../../lib/types';

@service('ecx')
export class ChromeExtensionsService extends ServiceBase implements RPC.Interface<ChromeExtensionsService> {
  // @ts-ignore
  loadExtension(cxId: string): Promise<Extension> { }
  // @ts-ignore
  unloadExtension(cxId: string): Promise<void> { }
  // @ts-ignore
  isUpToDate(cxId: string): Promise<boolean> { }
  // @ts-ignore
  getExtension(cxId: string): Promise<Extension> { }
  // @ts-ignore
  dispatchEvent(event: ExtensionEventMessage): Promise<void> { }
  // @ts-ignore
  addObserver(obs: RPC.ObserverNode<ChromeExtensionsServiceObserver>): Promise<RPC.Subscription> { }
}

@service('ecx')
export class ChromeExtensionsServiceObserver extends ServiceBase implements RPC.Interface<ChromeExtensionsServiceObserver> {
  // @ts-ignore
  onExtensionUpdated(extension: Extension): void { }
}
