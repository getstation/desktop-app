import { getFocusedTabId } from '../app/selectors';
import { RPC } from '../services/lib/types';
import { TabWebContentsAutoLoginDetailsProviderService } from '../services/services/tab-webcontents/interface';
import { getWebcontentsIdForTabId } from '../tab-webcontents/selectors';
import { StationStoreWorker } from '../types';
import { closeAll, displayRemoveLinkBanner } from './duck';
import { canSendLoginToWebContents, getCredentialsForWebContents } from './sagas';

export class TabWebContentsAutoLoginDetailsProviderServiceImpl extends TabWebContentsAutoLoginDetailsProviderService
  implements RPC.Interface<TabWebContentsAutoLoginDetailsProviderService> {
  store: StationStoreWorker;

  constructor(store: StationStoreWorker, uuid?: string) {
    super(uuid);
    this.store = store;
  }

  async getCredentials(webContentsId: number) {
    if (this.isWebContentsFocused(webContentsId) && canSendLoginToWebContents(webContentsId)) {
      return this.store.runSaga(getCredentialsForWebContents, webContentsId).done;
    }
    return { status: false };
  }

  async showRemoveLinkBanner(webContentsId: number) {
    if (this.isWebContentsFocused(webContentsId)) {
      this.store.dispatch(displayRemoveLinkBanner(true));
    }
  }

  async hideBanners(webContentsId: number) {
    if (this.isWebContentsFocused(webContentsId)) {
      this.store.dispatch(closeAll());
      this.store.dispatch(displayRemoveLinkBanner(false));
    }
  }

  private isWebContentsFocused(webContentsId: number) {
    const state = this.store.getState();

    const focusedTabId = getFocusedTabId(state);
    if (!focusedTabId) return;

    const focusedWebcontentsId = getWebcontentsIdForTabId(state, focusedTabId);

    return webContentsId === focusedWebcontentsId;
  }
}
