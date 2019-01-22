import { Subscribable } from 'rxjs/Observable';
import { observable as SymbolObservable } from 'rxjs/symbol/observable';
import { Consumer } from '../common';
import { ipc } from './index';

const protectedProvidersWeakMap = new WeakMap<IpcConsumer, ipc.IpcProviderInterface>();

export class IpcConsumer extends Consumer implements ipc.IpcConsumer {

  public readonly namespace = 'ipc';
  public subscribe: Subscribable<any>['subscribe'];

  // tslint:disable-next-line
  [SymbolObservable]() {
    return protectedProvidersWeakMap.get(this)!.bxToPluginChannel;
  }

  publish(args: any) {
    protectedProvidersWeakMap.get(this)!.pluginToBxChannel.next(args);
  }

  setProviderInterface(providerInterface: ipc.IpcProviderInterface) {
    protectedProvidersWeakMap.set(this, providerInterface);
    this.subscribe = providerInterface.bxToPluginChannel.subscribe.bind(providerInterface.bxToPluginChannel);
  }
}
