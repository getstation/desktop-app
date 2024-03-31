import { Observable, observable as Symbol_observable, Subscribable } from 'rxjs';

import { Consumer, DefaultWeakMap } from '../common';

import { ipc } from './index';

const protectedProvidersWeakMap = new DefaultWeakMap<IpcConsumer, ipc.IpcProviderInterface>();

export class IpcConsumer extends Consumer implements ipc.IpcConsumer {

  public readonly namespace = 'ipc';
  public subscribe: Subscribable<any>['subscribe'];

  // tslint:disable-next-line
  [Symbol_observable](): Observable<any> {
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
