import * as Immutable from 'immutable';
import { SagaIterator } from 'redux-saga';
import { all, call, put, select } from 'redux-saga/effects';
// @ts-ignore : no declaration file
import { UPDATE_UI_STATE, updateUI } from 'redux-ui/transpiled/action-reducer';
import {
  SET_VISIBILITY as BANG_SET_VISIBILITY,
  setVisibility as bangSetVisibility,
  SetVisibilityAction as BangSetVisibilityAction,
} from '../bang/duck';
import { isVisible as bangIsVisible } from '../bang/selectors';
import { CHANGE_SELECTED_APP_MAIN, ChangeSelectedAppMain } from '../nav/duck';
import {
  SET_VISIBILITY as NOTIFICATION_CENTER_SET_VISIBILITY,
  setVisibility as notificationCenterSetVisibility,
  SetVisibilityAction as NotificationCenterSetVisibilityAction,
} from '../notification-center/duck';
import { isVisible as notificationCenterIsVisible } from '../notification-center/selectors';
import { MARK_AS_DONE } from '../onboarding/duck';
import { isDone } from '../onboarding/selectors';
import { REHYDRATION_COMPLETE } from '../store/duck';
import { StationState } from '../types';
import { callService, takeEveryWitness } from '../utils/sagas';
import {
  SET_CURSOR_ICON,
  SetCursorIcon,
  TOGGLE_VISIBILITY as UI_TOGGLE_VISIBILITY,
  ToggleVisibility as UiToggleVisibility,
} from './duck';

// TODO search

type VisibilityActions =
  | NotificationCenterSetVisibilityAction
  | BangSetVisibilityAction
  | ChangeSelectedAppMain;

type VisibilityTypes =
  | NOTIFICATION_CENTER_SET_VISIBILITY
  | BANG_SET_VISIBILITY;

const actionCreatorsByActionTypes = Immutable.Map<VisibilityTypes, [VisibilityActions, () => boolean]>([
  [NOTIFICATION_CENTER_SET_VISIBILITY, [notificationCenterSetVisibility(false), notificationCenterIsVisible]],
  [BANG_SET_VISIBILITY, [bangSetVisibility('center-modal', false), bangIsVisible]],
]);

/**
 * ⚠ beware of infinite loop with this, because we are trigerring the same events as the ones
 * ⚠ we are listening.
 * @param {VisibilityActions} action
 * @returns {SagaIterator}
 */
function* computeElementsVisibility(action: VisibilityActions): SagaIterator {
  let mustShow: VisibilityTypes | boolean = false;
  const doNotHide: VisibilityTypes[] = [];
  switch (action.type) {
    case BANG_SET_VISIBILITY:
    case NOTIFICATION_CENTER_SET_VISIBILITY:
      if (action.visible) {
        mustShow = action.type;
      }
      break;
    case CHANGE_SELECTED_APP_MAIN:
      mustShow = true;
      doNotHide.push(BANG_SET_VISIBILITY);
      break;
  }
  if (!mustShow) return;

  const shouldBeHidden = actionCreatorsByActionTypes
    .filter((_, k) => k !== mustShow)
    .filter((_, k) => doNotHide.indexOf(k!) === -1);

  let hideAction: [VisibilityActions, () => boolean];
  // @ts-ignore: no iterator declaration
  for (hideAction of shouldBeHidden.values()) {
    const [visibilityAction, visibilitySelector] = hideAction;
    if (yield select(visibilitySelector)) {
      yield put(visibilityAction);
    }
  }
}

function* setCursorIconInWebContents({ cursor }: SetCursorIcon): SagaIterator {
  yield callService('cursor', 'setCursor', cursor);
}

/**
 * Toggle any boolean key in `ui`
 * @param {ToggleVisibility} action
 * @returns {SagaIterator}
 */
function* sagaToggleVisibility(action: UiToggleVisibility): SagaIterator {
  const { key } = action;
  const isVisible: boolean = yield select((state: StationState) => state.getIn(['ui', ...key] as any, false));

  yield put(updateUI(...key, !isVisible));
}

function* onBoardingState() {
  const state = yield select(isDone);
  yield call(setStateMenuItemResetCurrentApplication, state);
}

function* handleResetApplicationMenuStateFromOnboarding() {
  yield call(setStateMenuItemResetCurrentApplication);
}

function* handleResetApplicationMenuState(
  { payload: { key, name, value } }: { payload: { key: string, name: string, value: boolean } }) {
  switch (key) {
    case 'settings':
      if (name === 'isVisible') yield call(setStateMenuItemResetCurrentApplication, !value);
      break;
    case 'onboarding':
      if (name === 'showWelcomeBack') yield call(setStateMenuItemResetCurrentApplication, !value);
      break;
    case 'invitationModal':
      if (name === 'visible') yield call(setStateMenuItemResetCurrentApplication, !value);
      break;
    default:
      break;
  }
}

function* setStateMenuItemResetCurrentApplication(enabled: boolean = true) {
  yield callService('menu', 'setEnabled', {
    menuItemId: 'reset-current-application',
    value: enabled,
  });
}

export default function* main(): SagaIterator {
  yield all([
    takeEveryWitness(
      [
        NOTIFICATION_CENTER_SET_VISIBILITY,
        CHANGE_SELECTED_APP_MAIN,
        BANG_SET_VISIBILITY,
      ],
      computeElementsVisibility,
    ),
    takeEveryWitness(SET_CURSOR_ICON, setCursorIconInWebContents),
    takeEveryWitness(UI_TOGGLE_VISIBILITY, sagaToggleVisibility),
    takeEveryWitness(REHYDRATION_COMPLETE, onBoardingState),
    takeEveryWitness(MARK_AS_DONE, handleResetApplicationMenuStateFromOnboarding),
    takeEveryWitness(UPDATE_UI_STATE, handleResetApplicationMenuState),
  ]);
}
