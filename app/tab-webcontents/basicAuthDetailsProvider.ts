import { take } from 'redux-saga/effects';
import { RPC } from '../services/lib/types';
import { BasicAuthDetailsProviderService } from '../services/services/tab-webcontents/interface';
import { StationStoreWorker } from '../types';
import { PERFORM_BASIC_AUTH, promptWebcontentsBasicAuth } from './duck';
import { getTabWebcontentsByWebContentsId, getWebcontentsTabId } from './selectors';

export class BasicAuthDetailsProviderServiceImpl extends BasicAuthDetailsProviderService
  implements RPC.Interface<BasicAuthDetailsProviderService> {
  store: StationStoreWorker;

  constructor(store: StationStoreWorker, uuid?: string) {
    super(uuid);
    this.store = store;
  }

  async getAuthData(webContentsId: number, authInfo: Electron.AuthInfo) {
    const state = this.store.getState();

    const twc = getTabWebcontentsByWebContentsId(state, webContentsId);
    const tabId = getWebcontentsTabId(twc);

    this.store.dispatch(promptWebcontentsBasicAuth(tabId, true, authInfo));

    // Wait for the form to be submitted to continue
    const action = await this.store.runSaga(function* () {
      return yield take((act: any) => act.type === PERFORM_BASIC_AUTH && act.tabId === tabId);
    }).toPromise();

    this.store.dispatch(promptWebcontentsBasicAuth(tabId, false));

    return action;
  }
}
