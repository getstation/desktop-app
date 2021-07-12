import { ServiceBase } from '../../lib/class';
import { service } from '../../lib/decorator';
import { RPC } from '../../lib/types';

@service('process-manager')
export class ProcessManagerService extends ServiceBase implements RPC.Interface<ProcessManagerService> {
  // @ts-ignore
  open(): Promise<void> {}

  // @ts-ignore
  addObserver(obs: RPC.ObserverNode<ProcessManagerObserver>): Promise<RPC.Subscription> {}
}

@service('process-managaer')
export class ProcessManagerObserver extends ServiceBase implements RPC.Interface<ProcessManagerObserver> {
  // @ts-ignore
  onWillKillProcess(param: { pid: number }): void {}
}
