import { ServiceBase } from '../../lib/class';
import { service } from '../../lib/decorator';
import { RPC } from '../../lib/types';

/**
 * Service used by the SDK to allow plugins to communicate between their processes
 */
@service('sdk-ipc-broadcast')
export class SDKIPCBroadcastService extends ServiceBase implements RPC.Interface<SDKIPCBroadcastService> {
  // @ts-ignore
  sendToAll<T>(sourceId: string, message: T): Promise<void> {}
  // @ts-ignore
  addObserver(sourceId: string, obs: RPC.ObserverNode<SDKIPCBroadcastServiceObserver>): Promise<RPC.Subscription> {}
}

@service('sdk-ipc-broadcast')
export class SDKIPCBroadcastServiceObserver extends ServiceBase implements RPC.Interface<SDKIPCBroadcastServiceObserver> {
  // @ts-ignore
  onMessage<T>(message: T): void {}
}
