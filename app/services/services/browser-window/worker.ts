// @ts-ignore: no declaration file
import { setHideMainMenu } from '../../../app/duck';
import { StationStoreWorker } from '../../../types';
import { RPC } from '../../lib/types';
import { BrowserWindowManagerProviderService } from './interface';

export class BrowserWindowManagerProviderServiceImpl extends BrowserWindowManagerProviderService implements RPC.Interface<BrowserWindowManagerProviderService> {
  store: StationStoreWorker;

  constructor(store: StationStoreWorker, uuid?: string) {
    super(uuid);
    this.store = store;
  }

  async setHideMainMenu(hide: boolean) {
    this.store.dispatch(setHideMainMenu(hide));
  }
}
