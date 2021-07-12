// @ts-ignore : types
import { ExtensionEventMessage } from '../../../chrome-extensions/types';
import { ServiceSubscription } from '../../lib/class';
import { RPC } from '../../lib/types';
import { ChromeExtensionsService, ChromeExtensionsServiceObserver } from './interface';

export class ChromeExtensionsServiceDummy extends ChromeExtensionsService implements RPC.Interface<ChromeExtensionsService> {
  // @ts-ignore: dummy
  async loadExtension(extensionId: string) {}

  // @ts-ignore: dummy
  async unloadExtension(extensionId: string) {}

  // @ts-ignore: dummy
  async isUpToDate(extensionId: string) {}

  // @ts-ignore: dummy
  async getExtension(extensionId: string) {}

  // @ts-ignore: dummy
  async dispatchEvent(event: ExtensionEventMessage) {}

  // @ts-ignore: dummy
  async addObserver(obs: RPC.ObserverNode<ChromeExtensionsServiceObserver>) {
    return ServiceSubscription.noop;
  }
}
