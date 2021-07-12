import { Subject } from 'rxjs/Rx';
import { ServiceSubscription } from '../../lib/class';
import { RPC } from '../../lib/types';
import { SDKIPCBroadcastService, SDKIPCBroadcastServiceObserver } from './interface';

export class SDKIPCBroadcastServiceImpl extends SDKIPCBroadcastService implements RPC.Interface<SDKIPCBroadcastService> {
  messageSubject = new Subject<InternalMessage>();

  async sendToAll(sourceId: string, message: any) {
    this.messageSubject.next({
      message,
      sourceId,
    });
  }

  async addObserver(sourceId: string, obs: RPC.ObserverNode<SDKIPCBroadcastServiceObserver>) {
    if (obs.onMessage) {
      this.messageSubject.asObservable()
        .subscribe((message) => {
          if (message.sourceId !== sourceId) {
            obs.onMessage!(message.message);
          }
        });
    }
    return ServiceSubscription.noop;
  }
}

interface InternalMessage {
  sourceId: string;
  message: any;
}
