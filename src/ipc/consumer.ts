import { observable as Symbol_Observable } from 'rxjs/symbol/observable';
import { Consumer } from '../common';
import { ipc } from './index';

const protectedProvidersWeakMap = new WeakMap<IpcConsumer, ipc.IpcProviderInterface>();

export class IpcConsumer extends Consumer implements ipc.IpcConsumer {

  public readonly namespace = 'ipc';

  [Symbol_Observable]() {
    return protectedProvidersWeakMap.get(this)!.bxToPluginChannel;
  }

  send(args: any) {
    protectedProvidersWeakMap.get(this)!.pluginToBxChannel.next(args);
  }

  setProviderInterface(providerInterface: ipc.IpcProviderInterface) {
    protectedProvidersWeakMap.set(this, providerInterface);
  }
}
