import { setAutoLaunchEnabled } from '../../../../app/duck';
import { getAppName } from '../../../../app/selectors';
import { StationStoreWorker } from '../../../../types';
import { RPC } from '../../../lib/types';
import { AutolaunchProviderService } from '../interface';

export class AutolaunchProviderServiceImpl extends AutolaunchProviderService implements RPC.Interface<AutolaunchProviderService> {
  store: StationStoreWorker;

  constructor(store: StationStoreWorker, uuid?: string) {
    super(uuid);
    this.store = store;
  }

  async getAppName() {
    return getAppName(this.store.getState());
  }

  async setAutoLaunchEnabled(enable: boolean) {
    this.store.dispatch(setAutoLaunchEnabled(enable));
  }
}
