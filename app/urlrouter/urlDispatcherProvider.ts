import { DISPATCH_URL } from '../applications/duck';
import { RPC } from '../services/lib/types';
import { UrlDispatcherProviderService } from '../services/services/tab-webcontents/interface';
import { getTabWebcontentsByWebContentsId, getWebcontentsTabId } from '../tab-webcontents/selectors';
import { getApplicationIdByTabId } from '../tabs/selectors';
import { NEW_TAB } from './constants';
import { dispatchUrlSaga } from './sagas';
import { StationStoreWorker } from 'app/types';

export class UrlDispatcherProviderServiceImpl extends UrlDispatcherProviderService
  implements RPC.Interface<UrlDispatcherProviderService> {
  store: StationStoreWorker;

  constructor(store: StationStoreWorker, uuid?: string) {
    super(uuid);
    this.store = store;
  }

  async dispatchUrl(url: string, originWebContentsId: number) {
    const state = this.store.getState();

    const twc = getTabWebcontentsByWebContentsId(state, originWebContentsId);
    const tabId = getWebcontentsTabId(twc);
    const applicationId = getApplicationIdByTabId(state, tabId);

    // run the `dispatchUrlSaga`, which is the entry point to dispatch a new URL inside bx
    await this.store.runSaga(dispatchUrlSaga, {
      type: DISPATCH_URL, url, origin: { tabId, applicationId }, options: { target: NEW_TAB },
    }).toPromise();
  }
}
