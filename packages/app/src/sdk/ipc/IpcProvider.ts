import { ipc } from '@getstation/sdk';
import * as shortid from 'shortid';
import { Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { handleError } from '../../services/api/helpers';
import { observer } from '../../services/lib/helpers';
import services from '../../services/servicesManager';
import { AbstractProvider } from '../common';
import { SDKIpcProviderInterface } from './types';

interface ConsumerMessage {
  message: any,
  consumerId: string,
}

const consumersWeakMap = new WeakMap<ipc.IpcConsumer, SDKIpcProviderInterface>();

export default class IpcProvider extends AbstractProvider<ipc.IpcConsumer> {

  addConsumer(consumer: ipc.IpcConsumer) {
    const sourceId = `consumer-${shortid.generate()}`;
    super.pushConsumer(consumer);

    // Set communication channels
    const channels = createChannels();
    consumersWeakMap.set(consumer, channels);
    consumer.setProviderInterface(transformChannelsForConsumer(channels));

    initListener(sourceId, consumer).catch(handleError());

    // Subscribe to messages sent from plugin
    const subscription = channels.pluginToBxChannel.subscribe((message: any) => {
      const messageToSend: ConsumerMessage = {
        message,
        consumerId: consumer.id,
      };
      return services.sdkipc.sendToAll(sourceId, messageToSend);
    });

    super.subscribeConsumer(consumer, () => {
      subscription.unsubscribe();
    });
  }
}

/**
 * Creates 2 channels required to communicate between a plugin and BX
 * @returns {SDKIpcProviderInterface}
 */
function createChannels(): SDKIpcProviderInterface {
  const pluginToBxChannel = new Subject();
  const bxToPluginChannel = new Subject();
  return {
    pluginToBxChannel,
    bxToPluginChannel,
  };
}

/**
 * Both channels for Provider are Subject, but `bxToPluginChannel` just needs to be an Observable
 * on the Consumer side. This method ensures that it's the case.
 * @param {SDKIpcProviderInterface} channels
 * @returns {ipc.IpcProviderInterface}
 */
function transformChannelsForConsumer(channels: SDKIpcProviderInterface): ipc.IpcProviderInterface {
  return {
    bxToPluginChannel: channels.bxToPluginChannel.asObservable().pipe(share()),
    pluginToBxChannel: channels.pluginToBxChannel,
  };
}

function initListener(sourceId: string, consumer: ipc.IpcConsumer) {
  return services.sdkipc.addObserver(sourceId, observer({
    onMessage(message: any) {
      if (message.consumerId !== consumer.id) return;
      const channels = consumersWeakMap.get(consumer);
      if (channels) {
        channels.bxToPluginChannel.next(message.message);
      }
    },
  }, 'init-listener'));
}
