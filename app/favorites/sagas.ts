import { all, call, put, select } from 'redux-saga/effects';
import * as shortid from 'shortid';
import { getTabApplicationId, getTabFavicons, getTabTitle, getTabURL } from '../tabs/get';
import { getTabById } from '../tabs/selectors';
import { NEW_TAB, NEW_WINDOW } from '../urlrouter/constants';
import { dispatchUrlSaga } from '../urlrouter/sagas';
import { takeEveryWitness } from '../utils/sagas';
import {
  ADD_TAB,
  addFavorite,
  AddTabAsFavoriteAction,
  deleteFavorite,
  OPEN,
  OpenFavoriteAction,
  REMOVE,
  RemoveFavoriteAction,
} from './duck';
import { getFavorite } from './selectors';
import { reorderTab } from '../ordered-tabs/duck';

function* sagaAddTabAsFavorite(action: AddTabAsFavoriteAction) {
  const { tabId } = action;
  const tab = yield select(getTabById, tabId);

  const favoriteId = `favorite-${shortid.generate()}`;
  const favicons = getTabFavicons(tab);

  yield put(addFavorite(
    favicons ? favicons.toJS() : [],
    getTabTitle(tab)!,
    getTabURL(tab)!,
    getTabApplicationId(tab),
    favoriteId,
  ));
}

/**
 * Will remove the favorite from favorite.
 */
function* doRemoveFavorite(action: RemoveFavoriteAction) {
  const { favoriteId, tabId } = action;

  // Put back the related tab on top of the list if it exists
  if (tabId) yield put(reorderTab(tabId, 0));

  yield put(deleteFavorite(favoriteId));
}

function* openFavorite(action: OpenFavoriteAction) {
  const favorite = yield select(getFavorite, action.favoriteId);

  const origin = { applicationId: favorite.get('applicationId') };
  const options = {
    target: action.newWindow ? NEW_WINDOW : NEW_TAB,
  };
  yield call(dispatchUrlSaga, { url: favorite.get('url'), origin, options });
}

export default function* main() {
  yield all([
    takeEveryWitness(ADD_TAB, sagaAddTabAsFavorite),
    takeEveryWitness(OPEN, openFavorite),
    takeEveryWitness(REMOVE, doRemoveFavorite),
  ]);
}
