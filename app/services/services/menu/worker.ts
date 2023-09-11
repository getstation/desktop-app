// @ts-ignore: no declaration file
import { setHideMainMenu } from '../../../app/duck';
import { StationStoreWorker } from '../../../types';
import { RPC } from '../../lib/types';
import { MenuProviderService } from './interface';

export class MenuProviderServiceImpl extends MenuProviderService implements RPC.Interface<MenuProviderService> {
  store: StationStoreWorker;

  constructor(store: StationStoreWorker, uuid?: string) {
    super(uuid);
    this.store = store;
  }

  async setHideMainMenu(hide: boolean) {
    this.store.dispatch(setHideMainMenu(hide));
  }
}
