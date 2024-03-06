import { SDK } from '@getstation/sdk';
import { createStore, Store } from 'redux';
import { from, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { getReactTree } from './components/GDriveReduxProvider';
import reducer, { updateAccounts } from './duck.renderer';
import { State, UpdateTokensAction } from './types';

/**
 * Listen for update from main process, and dispatch to redux
 * @param sdk
 * @param store
 */
function initIpcListener(sdk: SDK, store: Store<State>) {
  return from(sdk.ipc)
    .pipe(filter(m => m.type === 'UPDATE_TOKENS'))
    .subscribe((m: UpdateTokensAction) => {
      store.dispatch(updateAccounts(m.tokens));
    });
}

/**
 * Redux store internally used by GDrive plugin
 * @returns {Store<State>}
 */
function initRedux(): Store<State> {
  return createStore(reducer);
}

let subscription: Subscription;

export default {

  activate: (sdk): void => {
    const store = initRedux();
    subscription = initIpcListener(sdk, store);

    sdk.react.createPortal(getReactTree(sdk, store), 'quickswitch', 10);
  },

  deactivate: (): void => {
    // TODO remove portal
    subscription.unsubscribe();
  },
};
