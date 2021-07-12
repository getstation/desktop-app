import { ServiceSubscription } from '../../lib/class';
import { RPC } from '../../lib/types';
import { ProcessManagerObserver, ProcessManagerService } from './interface';

const defaultOptions = {
  defaultSorting: {
    how: 'descending',
    path: 'cpu.percentCPUUsage',
  },
};

export class ProcessManagerServiceImpl extends ProcessManagerService implements RPC.Interface<ProcessManagerService> {

  async open() {
    // @ts-ignore
    const { openProcessManager } = await import('electron-process-manager');
    await openProcessManager(defaultOptions);
  }

  async addObserver(obs: RPC.ObserverNode<ProcessManagerObserver>) {
    if (obs.onWillKillProcess) {
      const emit = obs.onWillKillProcess;
      // @ts-ignore no declaration file
      const processManager = await import('electron-process-manager');
      const listener = (pid: number) => {
        emit({ pid });
      };
      processManager.on('will-kill-process', listener);
      const unsubscribe = () => processManager.removeListener('will-kill-process', listener);
      return new ServiceSubscription(unsubscribe, obs);
    }
    return ServiceSubscription.noop;
  }
}
