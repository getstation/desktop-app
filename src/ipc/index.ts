import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Consumer } from '../common';

export namespace ipc {

  export interface IpcConsumer extends Consumer {
    readonly id: string;
    readonly observable: Observable<any>;

    send(args: any): void;
    setProviderInterface(providerInterface: IpcProviderInterface): void;
  }

  export interface IpcProviderInterface {
    pluginToBxChannel: Subject<any>;
    bxToPluginChannel: Subject<any>;
  }

}
