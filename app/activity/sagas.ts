import ms = require('ms');
import { SagaIterator } from 'redux-saga';
import { delay } from 'redux-saga/effects';
import { all, call, fork, select, take } from 'redux-saga/effects';
import * as Sequelize from 'sequelize';
import Activity from '../activity/model';
import { getActiveTabId } from '../app/selectors';
import { SET_ACTIVE_TAB, SetActiveTabAction } from '../applications/duck';
import { getApplicationManifestURL, getApplicationSubdomain } from '../applications/get';
import sdk from '../sdk/default-client';
import { REHYDRATION_COMPLETE } from '../store/duck';
import { getApplicationByTabId, getTabById } from '../tabs/selectors';
import { StationTabImmutable } from '../tabs/types';
import { periodicTick, takeEveryWitness } from '../utils/sagas';

const recordNavigationActivity = (initialActiveTabId: string) => {
  let previousTabId = initialActiveTabId;

  return function* ({ tabId, silent }: SetActiveTabAction): SagaIterator {
    const tab: StationTabImmutable = yield select(getTabById, tabId);
    const application = yield select(getApplicationByTabId, tabId);
    const manifestURL = getApplicationManifestURL(application);
    const domain = getApplicationSubdomain(application);
    const tabUrl = tab.get('url');

    if (previousTabId !== tabId) {
      previousTabId = tabId;
      sdk.activity.push(tabId, { tabId, domain, tabUrl, silent }, 'nav-to-tab', manifestURL);
    }
  };
};

const cleanOldActivity = async (timeToKeepData: number): Promise<void> => {
  const timestampLimit = Date.now() - timeToKeepData;
  await Activity.destroy({
    where: {
      createdAt: {
        [Sequelize.Op.lt]: timestampLimit,
      },
    },
  });
};

function* cleanOldActivityEveryDay(): SagaIterator {
  const timeToKeepData = ms('180 days'); // about 3 months

  yield delay(ms('5 minutes'));

  yield call(cleanOldActivity, timeToKeepData);

  yield takeEveryWitness(periodicTick(ms('1 day')), function* (): SagaIterator {
    yield call(cleanOldActivity, timeToKeepData);
  });
}

export default function* main(): SagaIterator {
  yield take(REHYDRATION_COMPLETE);

  const activeTabId = yield select(getActiveTabId);

  yield all([
    takeEveryWitness(SET_ACTIVE_TAB, recordNavigationActivity(activeTabId)),
    fork(cleanOldActivityEveryDay),
  ]);
}
