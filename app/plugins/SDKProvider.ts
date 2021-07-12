import NotificationsSDKConsumer from './notifications/NotificationsSDKConsumer';
import NotificationsSDKProvider from './notifications/NotificationsSDKProvider';
import SlackSDKConsumer from './slack/SlackSDKConsumer';
import SlackSDKProvider from './slack/SlackSDKProvider';
import SnoozeSDKConsumer from './snooze/SnoozeSDKConsumer';
import SnoozeSDKProvider from './snooze/SnoozeSDKProvider';

export interface SDKConsumer {
  snooze: SnoozeSDKConsumer,
  slack: SlackSDKConsumer,
  notifications: NotificationsSDKConsumer
}

/**
 * @deprecated
 */
export default class DeprecatedSDKProvider {
  snooze: SnoozeSDKProvider;
  slack: SlackSDKProvider;
  notifications: NotificationsSDKProvider;

  constructor() {
    this.snooze = new SnoozeSDKProvider();
    this.slack = new SlackSDKProvider();
    this.notifications = new NotificationsSDKProvider();
  }

  get consumer(): SDKConsumer {
    return {
      snooze: this.snooze.consumer,
      slack: this.slack.consumer,
      notifications: this.notifications.consumer,
    };
  }
}
