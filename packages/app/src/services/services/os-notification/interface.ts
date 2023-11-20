import { ServiceBase } from '../../lib/class';
import { service } from '../../lib/decorator';
import { RPC } from '../../lib/types';

export type IOSNotificationServiceShowParam = {
  /**
   * Title of the notification.
   */
  title: string,
  /**
   * Body of the notification.
   */
  body?: string,
  /**
   * The URL to the image that should be used.
   */
  imageURL?: string,
  /**
   * True if the notification should not emit any sound.
   */
  silent?: boolean,
};
/**
 * Service used to display and interact with OS Notifications.
 *
 * Leverage `electron.Notification`.
 */
@service('os-notification')
export class OSNotificationService extends ServiceBase implements RPC.Interface<OSNotificationService> {
  /**
   * Forward a click event to the notification on the webContents
   */
  // @ts-ignore
  triggerClick(webContentsId: number, notificationId: string): Promise<void> {}
  /**
   * Show an OS notification.
   */
  // @ts-ignore
  show(param: IOSNotificationServiceShowParam): Promise<RPC.Node<OSNotification>> {}
  // @ts-ignore
  isDoNotDisturbEnabled(): Promise<boolean> {}
}

/**
 * Represents an OS Notification.
 */
@service('os-notification')
export class OSNotification extends ServiceBase implements RPC.Interface<OSNotification> {
  /**
   * Add an observer (click) to this Notification.
   */
  // @ts-ignore
  addObserver(obs: RPC.Node<OSNotificationObserver>): Promise<RPC.Subscription> {}
}

@service('os-notification')
export class OSNotificationObserver extends ServiceBase implements RPC.Interface<OSNotificationObserver> {
  /**
   * Will be called when the subject's notification is clicked.
   */
  // @ts-ignore
  onClick(): void {}
}
