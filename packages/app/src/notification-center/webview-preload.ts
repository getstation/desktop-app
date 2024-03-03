/* tslint:disable:function-name */
import { ipcRenderer } from 'electron';
import * as shortid from 'shortid';
import { EventTarget } from 'event-target-shim';

const RecursiveOverride = require('../utils/webview-override-helper');

const GRANTED = 'granted' as 'granted';

const getDefaultProperties = (title: string) => ({
  actions: [],
  badge: '',
  body: '',
  data: null,
  dir: 'auto',
  lang: '',
  tag: '',
  icon: '',
  image: '',
  requireInteraction: false,
  silent: false,
  timestamp: (new Date()).getTime(),
  title,
  vibrate: [],
});

export class BxNotification extends EventTarget('click', 'error', 'close', 'show') implements Notification {
  static permission = GRANTED;

  readonly id: string;

  readonly actions: ReadonlyArray<NotificationAction>;
  readonly badge: string;
  readonly body: string;
  readonly data: any;
  readonly dir: NotificationDirection;
  readonly icon: string;
  readonly image: string;
  readonly lang: string;
  onclick: ((this: BxNotification, ev: Event) => any) | null;
  onclose: ((this: BxNotification, ev: Event) => any) | null;
  onerror: ((this: BxNotification, ev: Event) => any) | null;
  onshow: ((this: BxNotification, ev: Event) => any) | null;
  readonly renotify: boolean;
  readonly requireInteraction: boolean;
  readonly silent: boolean;
  readonly tag: string;
  readonly timestamp: number;
  readonly title: string;
  readonly vibrate: ReadonlyArray<number>;

  constructor(title: string, options?: NotificationOptions) {
    super();

    // Chrome, Safari, etc. does not throw when title is empty string
    if (!title && title !== '') throw new Error('Title is required');
    this.id = `notif/${shortid.generate()}`;

    // default properties
    const properties = Object.assign({ }, getDefaultProperties(title), options || {});

    Object.keys(properties).forEach(key => {
      Object.defineProperty(this, key, {
        value: properties[key],
        writable: false,
      });
    });

    this._registerIPC();
    ipcRenderer.send('new-notification', this.id, {
      timestamp: this.timestamp,
      title: this.title,
      body: this.body,
      icon: this.icon,
    });
  }

  static requestPermission(deprecatedCallback?: NotificationPermissionCallback): Promise<NotificationPermission> {
    const request = Promise.resolve(GRANTED);
    if (deprecatedCallback) request.then(deprecatedCallback);
    return request;
  }

  close() {
    ipcRenderer.send('notification-close', this.id);
  }

  _registerIPC() {
    ipcRenderer.on('trigger-notification-click', this._handleNotificationClickIPC);
  }

  _unregisterIPC() {
    ipcRenderer.removeListener('trigger-notification-click', this._handleNotificationClickIPC);
  }

  _handleNotificationClickIPC = (_e: Event, notificationId: string) => {
    if (this.id !== notificationId) return;
    this.dispatchEvent(new MouseEvent('click'));
    this._unregisterIPC();
  }
}

RecursiveOverride(document, window, (windowObject: any) => windowObject.Notification = BxNotification);
