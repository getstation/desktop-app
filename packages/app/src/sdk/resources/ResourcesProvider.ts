import { resources } from '@getstation/sdk';
import ResourceRouterDispatcher from '../../resources/ResourceRouterDispatcher';
import { OpenHandlers, MetaDataHandlers } from '../../resources/types';

import { AbstractProvider } from '../common';

export default class ResourcesProvider extends AbstractProvider<resources.ResourcesConsumer> {
  private openHandlers: OpenHandlers;
  private metaDataHandlers: MetaDataHandlers;

  constructor(resourceRouter: ResourceRouterDispatcher) {
    super();
    this.openHandlers = new Map();
    this.metaDataHandlers = new Map();

    resourceRouter.applicationResourceRouter.setOpenHandlers(this.openHandlers);
    resourceRouter.applicationResourceRouter.setMetaDataHandlers(this.metaDataHandlers);
  }

  addConsumer(consumer: resources.ResourcesConsumer): void {
    super.pushConsumer(consumer);
    consumer.setProviderInterface(this.getProviderInterface());
    super.subscribeConsumer(consumer, () => { });
  }

  removeConsumer(consumer: resources.ResourcesConsumer): void {
    const manifestURL: string = consumer.id;
    this.clearHandlers(manifestURL);
    super.removeConsumer(consumer);
  }

  private getProviderInterface() {
    return {
      setOpenHandler: this.setOpenHandler.bind(this),
      setMetaDataHandler: this.setMetaDataHandler.bind(this),
      clearHandlers: this.clearHandlers.bind(this),
    };
  }

  private setOpenHandler(manifestURL: string, handler: resources.OpenHandler) {
    this.openHandlers.set(manifestURL, handler);
  }

  private setMetaDataHandler(manifestURL: string, handler: resources.MetaDataHandler) {
    this.metaDataHandlers.set(manifestURL, handler);
  }

  private clearHandlers(manifestURL: string) {
    this.openHandlers.delete(manifestURL);
    this.metaDataHandlers.delete(manifestURL);
  }
}
