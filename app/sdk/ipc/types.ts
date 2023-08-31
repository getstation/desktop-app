import { Subject } from 'rxjs';

export interface SDKIpcProviderInterface {
  pluginToBxChannel: Subject<any>;
  bxToPluginChannel: Subject<any>;
}
