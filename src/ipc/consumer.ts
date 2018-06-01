import { Observable } from 'rxjs/Observable';
import { Consumer } from '../common';
import { ipc } from './index';

const protectedProvidersWeakMap = new WeakMap<IpcConsumer, ipc.IpcProviderInterface>();

export class IpcConsumer extends Consumer implements ipc.IpcConsumer {

  public readonly namespace = 'ipc';
  public observable: Observable<any>;

  /*
  TODO see how we want to use it
  bus(channel: string) {
    return this.observable.filter(m => m.channel === channel);
  }

  publish(channel: string, ...args: any[]) {
    this.send({
      channel,
      args
    });
  }
  */

  send(args: any) {
    protectedProvidersWeakMap.get(this)!.pluginToBxChannel.next(args);
  }

  setProviderInterface(providerInterface: ipc.IpcProviderInterface) {
    protectedProvidersWeakMap.set(this, providerInterface);
    this.observable = providerInterface.bxToPluginChannel.asObservable().share();
  }
}
