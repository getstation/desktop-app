//import { remote } from 'electron';
import { shell as remoteShell } from '@electron/remote';
import log from 'electron-log';
import { SagaIterator } from 'redux-saga';
import { all, call, delay, fork, getContext, put, race, select, take } from 'redux-saga/effects';
import { getApplicationManifestURL } from '../../app/applications/get';
import { listAllApplications, manifestToApplicationItem } from '../../manifests';
import { logger } from '../api/logger';
import { BrowserXAppWorker } from '../app-worker';
import {
  createNewTab,
  DISPATCH_URL,
  DispatchURLAction,
  installApplication,
  navigateToApplicationTabAutomatically,
} from '../applications/duck';
import { getApplicationById } from '../applications/selectors';
import { REHYDRATION_COMPLETE } from '../store/duck';
import { navigateTabToURL, changeHashAndNavigateToTab } from '../tab-webcontents/duck';
import { setCursorIcon } from '../ui/duck';
import { getCursorIcon } from '../ui/selectors';
import { callService, takeEveryWitness, tryCatch } from '../utils/sagas';
import { DispatchUrlOptions } from './constants';
import { ApplicationItem, URLRouterAction, URLRouterActionAndDestination } from './types';

const queue = new Set();
const followRedirectsTimeout = 3000;
const errorMessageTooManyRedirects = 'too much redirecting';

function* urlFromRedirections(dispatch: DispatchURLAction): SagaIterator {
  const { url } = dispatch;

  yield put(setCursorIcon('wait'));

  try {
    yield race({
      task: callService('urlRouterHelper', 'resolveRedirects', { url }),
      timeout: delay(followRedirectsTimeout),
    });
  } catch (e) {
    if (e !== errorMessageTooManyRedirects) logger.notify(e);
  } finally {
    if ((yield select(getCursorIcon)) === 'wait') {
      yield put(setCursorIcon('auto'));
    }
  }

  return url;
}

export function* dispatchUrlSaga(
  dispatch: DispatchURLAction,
  dispatchUrlOptions: DispatchUrlOptions = {},
): SagaIterator {
  const bxApp: BrowserXAppWorker = yield getContext('bxApp');
  const { router } = bxApp;
  const { url, origin, options } = dispatch;
  const { afterFollowingRedirects, originalUrl } = dispatchUrlOptions;

  if (queue.has(url)) return;

  queue.add(url);

  const [action, destination]: URLRouterActionAndDestination = yield call([router, router.routeURL], url, origin!, options!);

  if (process.env.NODE_ENV !== 'test') log.debug('[dispatch url]', url, origin, options, action, destination);

  if (action === URLRouterAction.DEFAULT_BROWSER && !afterFollowingRedirects) {
    const urlFromRedirects = yield call(urlFromRedirections, dispatch);

    queue.delete(url);

    return yield call(
      dispatchUrlSaga,
      { ...dispatch, url: urlFromRedirects },
      { originalUrl: url, afterFollowingRedirects: true },
    );
  }

  queue.delete(url);

  const finalDispatch = action === URLRouterAction.DEFAULT_BROWSER ? { ...dispatch, url: originalUrl } : dispatch;
  yield call(triggerCorrespondingAction, action, destination, finalDispatch);

  return { url: finalDispatch.url, origin, options, action, destination };
}

function* triggerCorrespondingAction(
  action: URLRouterAction,
  destination: any,
  { url, origin, options }: DispatchURLAction
) {
  if (process.env.NODE_ENV === 'test') return;

  let originApplicationManifestURL = null;
  if (origin && origin.applicationId) {
    const application = yield select(getApplicationById, origin.applicationId);
    originApplicationManifestURL = getApplicationManifestURL(application);
  }

  switch (action) {
    case URLRouterAction.RELOAD:
      // dispatch(executeWebviewMethod(destination, 'reload'));
      break;
    case URLRouterAction.DEFAULT_BROWSER:
      remoteShell.openExternal(url);
      break;
    case URLRouterAction.NAV_TO_TAB:
      yield put(navigateToApplicationTabAutomatically(destination.tabId));
      break;
    case URLRouterAction.NAV_IN_TAB:
      yield put(navigateTabToURL(destination.tabId, url));
      break;
    case URLRouterAction.PUSH_AND_NAV_TO_TAB:
      yield put(changeHashAndNavigateToTab(destination.tabId, url));
      break;
    case URLRouterAction.NEW_TAB:
      yield put(createNewTab(destination.applicationId, url, { navigateToApplication: true }));
      break;
    case URLRouterAction.NEW_WINDOW:
      yield put(createNewTab(destination.applicationId, url, { detach: true, navigateToApplication: true }));
      break;
    case URLRouterAction.INSTALL_AND_OPEN: {
      yield put(installApplication(destination.manifestURL, {
        optOutFlow: true,
        installContext: { url, origin, options },
        navigate: true,
        andCreateTabWithURL: url,
      }));
      break;
    }
    default:
      break;
  }
}

export function* manifestsScopesClock(bxApp: BrowserXAppWorker) {
  yield take(REHYDRATION_COMPLETE);

  // When app is ready, update the tree source once
  const { router } = bxApp;

  const allScopes: ApplicationItem[] = listAllApplications().map(manifestToApplicationItem);

  yield router.dataRouter.next(allScopes);
}

export default function* main(bxApp: BrowserXAppWorker) {
  yield all([
    takeEveryWitness(DISPATCH_URL, dispatchUrlSaga),
    fork(tryCatch(manifestsScopesClock), bxApp),
  ]);
}
