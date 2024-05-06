import { select, take } from 'redux-saga/effects';
import { getManifestOrTimeout } from '../applications/api';
import ManifestProvider from '../applications/manifest-provider/manifest-provider';
import { RPC } from '../services/lib/types';
import { WebContentsOverrideData, WebContentsOverrideProviderService } from '../services/services/tab-webcontents/interface';
import { getApplicationByTabId } from '../tabs/selectors';
import { StationStoreWorker } from '../types';
import { NEW_WEBCONTENTS_ATTACHED_TO_TAB } from './duck';
import { getTabWebcontentsByWebContentsId, getWebcontentsTabId } from './selectors';

export class WebContentsOverrideProviderServiceImpl extends WebContentsOverrideProviderService
  implements RPC.Interface<WebContentsOverrideProviderService> {
  store: StationStoreWorker;
  manifestProvider: ManifestProvider;

  constructor(store: StationStoreWorker, manifestProvider: ManifestProvider, uuid?: string) {
    super(uuid);
    this.store = store;
    this.manifestProvider = manifestProvider;
  }

  async getOverrideData(webContentsId: number) {
    // Wait for redux to receive the info about the webcontents
    await this.store.runSaga(function* () {
      const twc = yield select(getTabWebcontentsByWebContentsId, webContentsId);
      // already populated
      if (twc) return;
      // not populated yet, so we wait
      yield take((act: any) => act.type === NEW_WEBCONTENTS_ATTACHED_TO_TAB && act.webcontentsId === webContentsId);
    }).toPromise();

    const overrides: WebContentsOverrideData = {};
    const manifest = await this.getManifestByWebContentsId(webContentsId);

    if (manifest && manifest.bx_override_user_agent) {
      overrides.userAgent = manifest.bx_override_user_agent;
    }

    return overrides;
  }

  protected async getManifestByWebContentsId(webContentsId: number) {
    const state = this.store.getState();

    const twc = getTabWebcontentsByWebContentsId(state, webContentsId);
    const tabId = getWebcontentsTabId(twc);
    if (!tabId) return;

    const application = getApplicationByTabId(state, tabId);
    if (!application) return;

    if (application.get('manifestURL')) {
      return getManifestOrTimeout(this.manifestProvider, application.get('manifestURL'));
    }
    return;
  }
}
