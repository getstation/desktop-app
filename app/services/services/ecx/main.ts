// @ts-ignore : types
import ECx from 'electron-chrome-extension';
import { Extension, ExtensionEventMessage } from '../../../chrome-extensions/types';
import { ServiceSubscription } from '../../lib/class';
import { RPC } from '../../lib/types';
import { ChromeExtensionsService, ChromeExtensionsServiceObserver } from './interface';

const initConfiguration = () => {
  const configuration = {
    fetcher: {
      autoUpdate: true,
    },
  };

  ECx.setConfiguration(configuration);
};

const isExtensionLoaded = (extensionId: string): boolean => ECx.isLoaded(extensionId);

const serializeExtension = (extension: any): Extension => ({
  ...extension, ...{ location: extension.location.path },
});

export class ChromeExtensionsServiceImpl extends ChromeExtensionsService implements RPC.Interface<ChromeExtensionsService> {
  constructor(uuid?: string) {
    super(uuid);
    initConfiguration();
  }

  async loadExtension(extensionId: string) {
    if (isExtensionLoaded(extensionId)) {
      return this.getExtension(extensionId);
    }

    const extension = await ECx.load(extensionId);
    return serializeExtension(extension);
  }

  async unloadExtension(extensionId: string) {
    return ECx.unload(extensionId);
  }

  async isUpToDate(extensionId: string) {
    return ECx.isUpToDate(extensionId);
  }

  async getExtension(extensionId: string) {
    const extension = await ECx.get(extensionId);
    return serializeExtension(extension);
  }

  async dispatchEvent(event: ExtensionEventMessage) {
    return ECx.sendEvent(event);
  }

  async addObserver(obs: RPC.ObserverNode<ChromeExtensionsServiceObserver>) {
    if (obs.onExtensionUpdated) {
      return new ServiceSubscription(
        ECx.fetcher.on(
          'chrome-extension-updated',
          (extension: Extension) => {
            obs.onExtensionUpdated!(extension);
          }
        ),
        obs
      );
    }
    return ServiceSubscription.noop;
  }
}
