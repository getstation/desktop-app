import { COLORS, getGradients, QUICK_DURATION, QUICK_INTERVAL } from '@getstation/theme';
import * as log from 'electron-log';
// @ts-ignore no declaration file
import ms = require('ms');
import { delay, SagaIterator } from 'redux-saga';
import { all, call, put } from 'redux-saga/effects';
import { READY } from '../app/duck';

import { periodicTick, takeEveryWitness, takeLatestWitness } from '../utils/sagas';
import { getMomentOfTheDay, getMomentOfTheDayAndProgress, getMyCoordinates, getSunCalc } from './api';
import {
  BEGIN_COLORS_TRANSITION,
  BeginColorsTransition,
  beginColorTransition,
  changeThemeColors,
  JUMP_COLORS_TRANSITION,
  JumpColorsTransition,
  jumpColorTransition,
  setCurrentLocation,
} from './duck';

let currentMomentOfTheDay: string = getMomentOfTheDay() || 'morning';
let clock: any;
let jumpInProgress = false;
const today = new Date();

/**
 * For testing purpose
 */
function installFakeTime() {
  const lolex = require('lolex');
  clock = lolex.install({
    now: today,
    toFake: ['Date'],
  });
}

/**
 * For testing purpose
 * @returns {SagaIterator}
 */
function* doInstallFakeClock(): SagaIterator {
  if (process.env.STATION_QUICK_TRANSITIONS) {
    installFakeTime();
  }
}

/**
 * Returns SunCalc after retrieving coordinates.
 * If it fails, returns `undefined`
 * @return {SagaIterator}
 */
function* sagaGetSunCalc(): SagaIterator {
  let suncalc: any = undefined;
  try {
    const coords = yield call(getMyCoordinates);
    suncalc = yield call(getSunCalc, coords);
  } catch (e) {
    log.error(e);
  }
  return suncalc;
}

/**
 * For testing purpose
 * @returns {SagaIterator}
 */
function* triggerTransition({ from, to }: { from: number, to: number }): SagaIterator {
  if (!clock) {
    log.error('Forgot to set STATION_QUICK_TRANSITIONS ?');
    return;
  }
  const fromDate = new Date(today);
  const toDate = new Date(today);
  fromDate.setHours(from / 3600, (from % 3600) / 60, from % 60, 0);
  toDate.setHours(to / 3600, (to % 3600) / 60, to % 60, 0);
  log.debug('From', fromDate, 'to', toDate);
  clock.setSystemTime(fromDate);
  const suncalc = yield call(sagaGetSunCalc);
  const m = getMomentOfTheDay(suncalc);
  if (m) {
    currentMomentOfTheDay = m;
  }
  clock.setSystemTime(toDate);
}

/**
 * Okay, sit down, take a coffee, this is complicated...
 * @returns {SagaIterator}
 */
function* checkNewThemeColors(): SagaIterator {
  // FIXME? Didn't find a more handy way
  if (jumpInProgress) return;
  let [momentOfTheDay, ratio] = [currentMomentOfTheDay, 0];
  const suncalc = yield call(sagaGetSunCalc);
  try {
    [momentOfTheDay, ratio] = getMomentOfTheDayAndProgress(suncalc);
  } catch (e) {
    log.error(e);
  }
  // First, we check if we must initiate a transition
  if (currentMomentOfTheDay !== momentOfTheDay) {
    const previousFromMomentOfTheDay = COLORS.previousKey(momentOfTheDay, true);
    // This `jump` variable here tell us if we had a jump in time,
    // i.e. the previously saved momentOfTheDay and the current one are not subsequent.
    // This can happen if we close our laptop, and open it some times later
    const jump = previousFromMomentOfTheDay !== currentMomentOfTheDay;
    if (jump) {
      log.debug('[theme] initiating jump change.', currentMomentOfTheDay, '->', previousFromMomentOfTheDay);
      yield put(jumpColorTransition(COLORS.get(currentMomentOfTheDay).colors, COLORS.get(previousFromMomentOfTheDay).colors));
      currentMomentOfTheDay = previousFromMomentOfTheDay;
    } else {
      // To see what is the purpose of ratio, refer to `startColorsTransition`
      yield put(beginColorTransition(currentMomentOfTheDay, momentOfTheDay, ratio));
      currentMomentOfTheDay = momentOfTheDay;
    }
  }
}

/**
 * Jump transition are quick transitions between colors palettes (and not between momentOfTheDay).
 * Those transitions are here to catch up time. Dock icon is not transitionned,
 * but directly set to target color to save computing time, and avoid caching.
 * @param {string[]} fromColors
 * @param {string[]} toColors
 * @returns {SagaIterator}
 */
function* jumpColorsTransition({ fromColors, toColors }: JumpColorsTransition): SagaIterator {
  jumpInProgress = true;
  log.debug('[theme] starting quick color change from', fromColors, 'to', toColors);
  const duration = QUICK_DURATION;
  const frameInterval = QUICK_INTERVAL;
  let cursor = 0;

  const gradients = getGradients(fromColors, toColors, duration, frameInterval);

  const tickChannel = yield call(periodicTick, frameInterval, duration);
  yield takeEveryWitness(tickChannel, function* () {
    if (cursor >= gradients.length) return;
    yield put(changeThemeColors(gradients[cursor]));
    cursor += 1;
  });
  yield call(delay, duration);
  jumpInProgress = false;
}

/**
 * That's the real 'normal' transition from a momentOfTheDay to the next one
 * @param {string} fromMoment
 * @param {string} toMoment
 * @param {number} ratio
 * @returns {SagaIterator}
 */
function* startColorsTransition({ fromMoment, toMoment, ratio }: BeginColorsTransition): SagaIterator {
  log.debug('[theme] starting color change from', fromMoment, 'to', toMoment);
  const fromThemeColorScheme = COLORS.get(fromMoment);
  const toThemeColorScheme = COLORS.get(toMoment);
  let cursor = 0;
  let stopAt: number;
  let duration = toThemeColorScheme.duration;
  const frameInterval = toThemeColorScheme.frameInterval;

  const gradients = getGradients(fromThemeColorScheme.colors, toThemeColorScheme.colors, duration, frameInterval);
  stopAt = gradients.length - 1;

  // Okay now that...
  if (ratio !== undefined) {
    // `ratio` means "we had catch up time, but we're in the middle of a long transition"
    // i.e. if we have a transition from 6:00AM to 6:30AM, and we woke station at 6:15AM,
    // then the ratio is 0.5
    cursor = Math.trunc(gradients.length * ratio);
    if (cursor >= gradients.length) {
      cursor = gradients.length - 1;
    }
    // `ratio === 0` means we are just at the beginning of the normal transition, so no particular action.
    if (ratio > 0) {
      // If we enter here, we must assure that we have a jumpTransition between the starting point
      // of the transition, and the moment we should be.
      // i.e. We're doing a jumpTransition from 0 to `ratio`
      yield call(jumpColorsTransition, jumpColorTransition(gradients[0], gradients[cursor]));
      // And here, we're up to date
      if (ratio === 1) return;
    }
    duration = Math.trunc(toThemeColorScheme.duration * ratio);
  }

  const tickChannel = yield call(periodicTick, frameInterval, duration);
  log.debug('[theme] ratio:', ratio);
  log.debug('[theme] duration:', duration);
  log.debug('[theme] transitionning from', cursor, 'to', stopAt, '- for a total of', gradients.length, 'steps');
  yield takeEveryWitness(tickChannel, function* () {
    if (cursor >= stopAt) return;
    yield put(changeThemeColors(gradients[cursor]));
    cursor += 1;
  });
}

function* doUpdateCurrentLocation(): SagaIterator {
  log.debug('[theme] Update current location');
  try {
    const coords = yield call(getMyCoordinates);
    // TODO: check if coords have changed before changing them
    yield put(setCurrentLocation(coords));
  } catch (e) {
    log.error(e);
  }
}

export default function* main(): SagaIterator {
  yield all([
    takeEveryWitness(periodicTick(1000), checkNewThemeColors),
    takeLatestWitness(BEGIN_COLORS_TRANSITION, startColorsTransition),
    takeLatestWitness(JUMP_COLORS_TRANSITION, jumpColorsTransition),
    takeLatestWitness(READY, doUpdateCurrentLocation),
    takeLatestWitness(READY, doInstallFakeClock),
    takeEveryWitness(periodicTick(ms('1hour')), doUpdateCurrentLocation),
    takeEveryWitness('TEST/TRANSITION', triggerTransition),
  ]);
}
