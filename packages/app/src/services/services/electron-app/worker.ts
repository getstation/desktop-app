import log from 'electron-log';

// @ts-ignore: no declaration file
import { setMinimizeToTray } from '../../../app/duck';
import { StationStoreWorker } from '../../../types';
import { RPC } from '../../lib/types';
import { ElectronAppServiceProviderService } from './interface';

export class ElectronAppServiceProviderServiceImpl extends ElectronAppServiceProviderService implements RPC.Interface<ElectronAppServiceProviderService> {
  store: StationStoreWorker;

  constructor(store: StationStoreWorker, uuid?: string) {
    super(uuid);
    this.store = store;
  }

  async showTrayIcon() {
    log.info('Provider showTrayIcon');
    this.store.dispatch(setMinimizeToTray(true));
  }

  async hideTrayIcon() {
    log.info('Provider hideTrayIcon');
    this.store.dispatch(setMinimizeToTray(false));
  }
}
