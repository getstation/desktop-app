import { Observable, observable as Symbol_observable, Subject, Subscribable } from 'rxjs';

import { Consumer } from '../common';

export namespace ipc {

  /**
   * Communicate with other processes of the current plugin
   * @example
   * // Code executed by a renderer process
   * Observable.from(sdk.ipc).subscribe((message) => {
   *   console.log(message.message); // hello world
   * });
   *
   * // Code executed by the main process
   * sdk.ipc.publish({ message: 'hello world' });
   */
  export interface IpcConsumer extends Consumer, Subscribable<any> {
    readonly id: string;

    // @ts-ignore: Typescript limitation until Symbol.observable is considered native
    [Symbol_observable](): Observable<any>;

    /**
     * Sends a message to all other processes of the plugin
     * @param args
     */
    publish(args: any): void;

    /**
     * Internal usage - Set the provider for this consumer
     * @protected
     * @param {ipc.IpcProviderInterface} providerInterface
     */
    setProviderInterface(providerInterface: IpcProviderInterface): void;
  }

  export interface IpcProviderInterface {
    pluginToBxChannel: Subject<any>;
    bxToPluginChannel: Observable<any>;
  }

}
