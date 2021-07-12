import { Subject } from 'rxjs/Subject';

export interface SDKIpcProviderInterface {
  pluginToBxChannel: Subject<any>;
  bxToPluginChannel: Subject<any>;
}
