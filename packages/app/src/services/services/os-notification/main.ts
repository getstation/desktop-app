import { Notification, webContents } from 'electron';

import { ServiceSubscription } from '../../lib/class';
import { RPC } from '../../lib/types';
import { IOSNotificationServiceShowParam, OSNotification, OSNotificationObserver, OSNotificationService } from './interface';
import { getDoNotDisturb, asNativeImage } from './utils';

export class OSNotificationServiceImpl extends OSNotificationService implements RPC.Interface<OSNotificationService> {

  async show(param: IOSNotificationServiceShowParam) {
    const notificationOptions: Electron.NotificationConstructorOptions = {
      title: param.title,
      actions: [],
      body: '',
      silent: param.silent,
    };

    if (param.imageURL) {

      notificationOptions.icon = await asNativeImage(param.imageURL);
    }
    if (param.body) {
      notificationOptions.body = param.body;
    }

    const notification = new Notification(notificationOptions);
    notification.show();
    return new OSNotificationImpl(notification);
  }

  async triggerClick(webContentsId: number, notificationId: string) {
    try {
      const myWebcontent = webContents.fromId(webContentsId);
      if (!myWebcontent) return;
      // Send signal back to the webview to trigger click callbacks if any
      myWebcontent.send('trigger-notification-click', notificationId);
    } catch (e) {}
  }

  async isDoNotDisturbEnabled() {
    return getDoNotDisturb();
  }

}

export class OSNotificationImpl extends OSNotification implements RPC.Interface<OSNotification> {
  notif: Notification;

  constructor(notif: Notification) {
    super();
    this.notif = notif;
  }

  async addObserver(obs: RPC.Node<OSNotificationObserver>) {
    const cb = () => obs.onClick();
    this.notif.on('click', cb);
    return new ServiceSubscription({
      unsubscribe: () => this.notif.removeListener('click', cb),
    }, obs);
  }
}
