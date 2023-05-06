import log from 'electron-log';
import { eventChannel, SagaIterator } from 'redux-saga';
import { all, call, delay, put, select } from 'redux-saga/effects';
import {
  askEnableNotifications,
  disableNotifications,
  enableNotifications,
  navigateToApplicationTabAutomatically,
} from '../../app/applications/duck';
import { MAIN_APP_READY } from '../app/duck';
import { ASK_ENABLE_NOTIFICATIONS, TOGGLE_NOTIFICATIONS } from '../applications/duck';
import { getNotificationsEnabled } from '../applications/selectors';
import { addNotification, clearNotifications, removeNotification, RequestForApplicationNotificationsStep } from '../notifications/duck';
import {
  getNotificationBody,
  getNotificationIcon,
  getNotificationOptions,
  getNotificationTabId,
  getNotificationTitle,
  getNotificationWebContentsId,
} from '../notifications/get';
import { getNotificationById } from '../notifications/selectors';
import { getProvider } from '../plugins';
import DeprecatedSDKProvider from '../plugins/SDKProvider';
import { observer } from '../services/lib/helpers';
import { NewNotificationProps } from '../services/services/tab-webcontents/interface';
import { ATTACH_WEBCONTENTS_TO_TAB } from '../tab-webcontents/duck';
import { getWebcontentsIdForTabId } from '../tab-webcontents/selectors';
import { getTabApplicationId } from '../tabs/get';
import { getTabById } from '../tabs/selectors';
import {
  callService,
  createWebContentsServiceObserverChannel,
  takeEveryWithAck,
  takeEveryWitness,
  takeLatestWitness,
} from '../utils/sagas';
import { showOSNotification } from './api';
import { INFINITE, SYNC_WITH_OS } from './constants';
import {
  appendNotification,
  AskEnableNotificationsAction,
  MARK_ALL_AS_READ,
  MARK_AS_READ,
  markAsRead,
  MarkAsReadAction,
  NEW_NOTIFICATION,
  newNotification,
  NewNotificationAction,
  NOTIFICATION_CLICK,
  notificationClick,
  NotificationClickAction,
  removeAllNotifications,
  removeNotification as removeNotificationFromNotificationCenter,
  RESET_SNOOZE_DURATION,
  resetSnoozeDuration,
  ResetSnoozeDurationAction,
  resetSnoozeStartedOn,
  SET_SNOOZE_DURATION,
  setSnoozeDuration,
  SetSnoozeDurationAction,
  setSnoozeStartedOn,
  setVisibility,
  SHOW_NOTIFICATION,
  showNotification,
  ShowNotificationAction,
  TOGGLE_VISIBILITY,
} from './duck';
import ElectronNotificationStatePoller from './lib/ElectronNotificationStatePoller';
import { getSnoozeDuration, isVisible } from './selectors';
import { RPC } from '../services/lib/types';
import { OSNotification } from '../services/services/os-notification/interface';

const ms = require('ms');

function* sagaSnooze(action: SetSnoozeDurationAction): SagaIterator {
  const { snooze }: DeprecatedSDKProvider = yield call(getProvider);

  const { via, duration } = action;
  // Update start date
  yield put(setSnoozeStartedOn(Date.now()));

  snooze.triggerSet(duration);

  if (duration === SYNC_WITH_OS) {
    log.debug('snooze is synced with OS');
    return;
  }

  if (duration === INFINITE) {
    log.debug('snooze started for an infinite time');
    return;
  }

  const durationInMs: number = ms(duration);

  log.debug(`snooze started: ${duration}`);

  yield delay(durationInMs);
  yield put(resetSnoozeDuration(via));
  log.debug('snooze finish');
}

function* sagaResetSnooze(action: ResetSnoozeDurationAction): SagaIterator {
  const { snooze }: DeprecatedSDKProvider = yield call(getProvider);
  snooze.triggerReset();

  // Clear start date
  yield put(resetSnoozeStartedOn());
}

function* sagaNewNotification(action: NewNotificationAction): SagaIterator {
  // Call listeners
  const { notifications }: DeprecatedSDKProvider = yield call(getProvider);
  const [e, tamperedAction] = yield call([notifications, notifications.callNew], action);
  if (e.isDefaultPrevented()) return;
  const { applicationId, tabId, notificationId, options, props: { title, timestamp, body, icon } } = tamperedAction;
  yield put(addNotification(
    notificationId,
    { applicationId, tabId, title, timestamp, body, icon,
      full: options.full, silent: options.silent, webContentsId: options.webContentsId }
  ));
  yield put(appendNotification(notificationId));
  yield put(showNotification(notificationId));
}

function* sagaShowNotification(action: ShowNotificationAction): SagaIterator {
  const snooze = yield select(getSnoozeDuration);
  const { notificationId } = action;

  const notificationState = yield select(getNotificationById, notificationId);
  if (!notificationState || snooze) {
    return;
  }

  const notif = yield call(showOSNotification, {
    title: getNotificationTitle(notificationState),
    body: getNotificationBody(notificationState),
    imageURL: getNotificationIcon(notificationState),
    silent: getNotificationOptions(notificationState).silent,
  });

  yield takeEveryWitness(notificationClickChannel(notif), function* handle() {
    yield put(notificationClick(notificationId, 'pop_up'));
  });
}

const notificationClickChannel = (notif: RPC.Node<OSNotification>) => eventChannel(emit => {
  notif.addObserver(observer({
    onClick: () => emit({}),
  }));
  return () => { };
});

function* sagaNotificationClick(action: NotificationClickAction): SagaIterator {
  const { notificationId } = action;
  // Mark notification as read
  yield put(markAsRead(notificationId));

  const notification = yield select(getNotificationById, notificationId);
  if (!notification) return;

  let webcontentsId = getNotificationWebContentsId(notification);

  if (!webcontentsId) {
    const tabId = getNotificationTabId(notification);
    if (!tabId) return;
    yield put(navigateToApplicationTabAutomatically(tabId));

    webcontentsId = yield select(getWebcontentsIdForTabId, tabId);
    if (!webcontentsId) return;
  }

  yield callService('osNotification', 'triggerClick', webcontentsId, notificationId);
}

function* sagaMarkAsRead(action: MarkAsReadAction): SagaIterator {
  const { notificationId } = action;

  yield put(removeNotificationFromNotificationCenter(notificationId));
  yield put(removeNotification(notificationId));
}

function* sagaMarkAllAsRead(): SagaIterator {
  yield put(removeAllNotifications());
  yield put(clearNotifications());
}

function* interceptNotificationEventsFromWebContents({ webcontentsId, tabId }: { webcontentsId: number, tabId: string }) {
  const tab = yield select(getTabById, tabId);
  if (!tab) return;
  const applicationId = getTabApplicationId(tab);

  const newNotificationChannel = createWebContentsServiceObserverChannel(
    webcontentsId, 'addNotificationsObserver', 'onNewNotification', 'intercept-notif-open');
  yield takeEveryWitness(newNotificationChannel, function* handle(props: NewNotificationProps) {
    const isNotifEnabled = yield select(getNotificationsEnabled, applicationId);
    // disable notification if explicity choose it
    if (isNotifEnabled === false) return;
    if (isNotifEnabled === undefined) {
      yield put(askEnableNotifications({
        applicationId,
        tabId,
        notificationId: props.id,
        props,
        step: RequestForApplicationNotificationsStep.ASK,
      }));
    }
    yield put(newNotification(applicationId, tabId, props.id, props));
  });

  const notificationCloseChannel = createWebContentsServiceObserverChannel(
    webcontentsId, 'addNotificationsObserver', 'onNotificationClose', 'intercept-notif-close');
  yield takeEveryWitness(notificationCloseChannel, function* handle(/*notificationId: string*/) {
    // AL: From my understanding of the [specs](https://notifications.spec.whatwg.org/#dom-notification-close)
    // calling Notification#close should remove the notification from the notification center
    // however, most apps (like Slack) misinterpreted the `#close` and use it to make sure a
    // Notification doe not stay on screen.
    // Therefore, when `#close` is called, by default, we do not remove the notification
    // — unless `removeNotificationOnClose` is set in service data

    // TODO fetch flag from manifest?
    // yield put(removeNotificationFromNotificationCenter(notificationId));
    // yield put(removeNotification(notificationId));
  });
}

function* sagaToggleVisibility(): SagaIterator {
  const visible = yield select(isVisible);
  yield put(setVisibility(!visible));
}

function pollerEmitterChannel() {
  return eventChannel((emitter: any) => {
    const poller = new ElectronNotificationStatePoller();

    poller.on('os-dnd-state', (event: any) =>
      emitter(event)
    );

    return () => {
      log.debug('[POLLER EMITTER CHANNEL] Channel Off');
      poller.stop();
    };
  });
}

function* electronNotificationStatePoller(): SagaIterator {
  const chan = yield call(pollerEmitterChannel);

  yield takeEveryWitness(chan, function* handle(state: any) {
    log.debug('[NOTIFICATION STATE POLLER] event is', state);

    if (state) {
      yield put(setSnoozeDuration('os', SYNC_WITH_OS));
    } else {
      yield put(resetSnoozeDuration('os'));
    }
  });
}

function* askEnableNotificationsFlow({ applicationId, tabId, notificationId, props, step }: AskEnableNotificationsAction): SagaIterator {
  if (step === RequestForApplicationNotificationsStep.ENABLE) {
    yield put(enableNotifications(applicationId));
    yield put(askEnableNotifications({
      applicationId,
      tabId,
      notificationId,
      props,
      step: RequestForApplicationNotificationsStep.FINISH,
    }));
  }
  if (step === RequestForApplicationNotificationsStep.DISABLE) {
    yield put(disableNotifications(applicationId));
    yield put(askEnableNotifications({
      applicationId,
      tabId,
      notificationId,
      props,
      step: RequestForApplicationNotificationsStep.FINISH,
    }));
  }
}

function* toggleAppNotifications({ applicationId }: { applicationId: string }): SagaIterator {
  if (yield select(getNotificationsEnabled, applicationId)) {
    yield put(disableNotifications(applicationId));
  } else {
    yield put(enableNotifications(applicationId));
  }
}

export default function* main(): SagaIterator {
  yield all([
    takeEveryWitness(ATTACH_WEBCONTENTS_TO_TAB, interceptNotificationEventsFromWebContents),
    takeLatestWitness(SET_SNOOZE_DURATION, sagaSnooze),
    takeLatestWitness(RESET_SNOOZE_DURATION, sagaResetSnooze),
    takeEveryWithAck(NEW_NOTIFICATION, sagaNewNotification),
    takeEveryWitness(NOTIFICATION_CLICK, sagaNotificationClick),
    takeEveryWitness(SHOW_NOTIFICATION, sagaShowNotification),
    takeEveryWitness(MARK_AS_READ, sagaMarkAsRead),
    takeEveryWitness(MARK_ALL_AS_READ, sagaMarkAllAsRead),
    takeEveryWitness(TOGGLE_VISIBILITY, sagaToggleVisibility),
    takeEveryWitness(MAIN_APP_READY, electronNotificationStatePoller),
    takeEveryWitness(ASK_ENABLE_NOTIFICATIONS, askEnableNotificationsFlow),
    takeEveryWitness(TOGGLE_NOTIFICATIONS, toggleAppNotifications),
  ]);
}
