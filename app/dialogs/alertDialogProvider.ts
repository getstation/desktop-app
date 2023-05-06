import { IconSymbol, Style } from '@getstation/theme';
import { take } from 'redux-saga/effects';
import * as shortid from 'shortid';
import { Action } from 'redux';
import { RPC } from '../services/lib/types';
import { AlertDialogProviderService } from '../services/services/tab-webcontents/interface';
import { getTabWebcontentsByWebContentsId, getWebcontentsTabId } from '../tab-webcontents/selectors';
import { StationStoreWorker } from '../types';
import { addItem, isClickDialogAction } from './duck';

export class AlertDialogProviderServiceImpl extends AlertDialogProviderService implements RPC.Interface<AlertDialogProviderService> {
  store: StationStoreWorker;

  constructor(store: StationStoreWorker, uuid?: string) {
    super(uuid);
    this.store = store;
  }

  async show(webContentsId: number, { message, title }: { message: string, title: string }) {
    const id = `dialog-${shortid.generate()}`;
    const state = this.store.getState();

    const twc = getTabWebcontentsByWebContentsId(state, webContentsId);
    if (!twc) return;

    const tabId = getWebcontentsTabId(twc);
    if (!tabId) return;

    const action = addItem({
      id,
      title,
      message,
      tabId,
      actions: [
        { onClick: 'close', icon: IconSymbol.CROSS, style: Style.TERTIARY },
        { onClick: 'open-tab', icon: IconSymbol.SHOW, style: Style.SECONDARY },
      ],
    });
    this.store.dispatch(action);

    // On the implementation side, the alert is blocking the underlying webview until it's clicked.
    // So we wait for the click event:
    await this.store.runSaga(function* () {
      yield take((act: Action) => isClickDialogAction(act) && act.dialog.id === id);
      return;
    }).toPromise();

    return;
  }
}
