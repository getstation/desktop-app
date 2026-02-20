// @ts-ignore : types
// import ECx from 'electron-chrome-extension';
import { ExtensionEventMessage } from '../../../chrome-extensions/types';
import { ServiceSubscription } from '../../lib/class';
import { RPC } from '../../lib/types';
import { ChromeExtensionsService, ChromeExtensionsServiceObserver } from './interface';

const initConfiguration = () => {
  const _configuration = {
    fetcher: {
      autoUpdate: true,
    },
  };

  // ECx.setConfiguration(configuration);
};

const isExtensionLoaded = (_extensionId: string): boolean => false; // ECx.isLoaded(extensionId);

export class ChromeExtensionsServiceImpl extends ChromeExtensionsService implements RPC.Interface<ChromeExtensionsService> {
  constructor(uuid?: string) {
    super(uuid);
    initConfiguration();
  }

  async loadExtension(extensionId: string) {
    if (isExtensionLoaded(extensionId)) {
      return this.getExtension(extensionId);
    }

    // const extension = await ECx.load(extensionId);
    // return serializeExtension(extension);
    console.warn('Chrome extensions disabled in Electron 31+');
    return null;
  }

  async unloadExtension(_extensionId: string) {
    // return ECx.unload(extensionId);
    return;
  }

  async isUpToDate(_extensionId: string) {
    // return ECx.isUpToDate(extensionId);
    return true;
  }

  async getExtension(_extensionId: string) {
    // const extension = await ECx.get(extensionId);
    // return serializeExtension(extension);
    return null;
  }

  async dispatchEvent(_event: ExtensionEventMessage) {
    // return ECx.sendEvent(event);
    return;
  }

  async addObserver(_obs: RPC.ObserverNode<ChromeExtensionsServiceObserver>) {
    /*
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
    */
    return ServiceSubscription.noop;
  }
}
