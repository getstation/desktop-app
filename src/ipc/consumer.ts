import { Observable } from 'rxjs/Observable';
import { Consumer } from '../common';
import { ipc } from './index';

const protectedProvidersWeakMap = new WeakMap<IpcConsumer, ipc.IpcProviderInterface>();

export class IpcConsumer extends Consumer implements ipc.IpcConsumer {

  public readonly namespace = 'ipc';
  public observable: Observable<any>;
  public id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }

  send(args: any) {
    protectedProvidersWeakMap.get(this)!.pluginToBxChannel.next(args);
  }

  setProviderInterface(providerInterface: ipc.IpcProviderInterface) {
    protectedProvidersWeakMap.set(this, providerInterface);
    this.observable = providerInterface.bxToPluginChannel.asObservable();
  }
}
