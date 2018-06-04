import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { observable as Symbol_Observable } from 'rxjs/symbol/observable';
import { Consumer } from '../common';

export namespace ipc {

  export interface IpcConsumer extends Consumer {
    readonly id: string;

    // @ts-ignore: Typescript limitation until Symbol.observable is
    // considered native
    [Symbol_Observable](): Observable<any>;
    send(args: any): void;
    setProviderInterface(providerInterface: IpcProviderInterface): void;
  }

  export interface IpcProviderInterface {
    pluginToBxChannel: Subject<any>;
    bxToPluginChannel: Observable<any>;
  }

}
