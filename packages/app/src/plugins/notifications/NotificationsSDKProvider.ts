import NotificationsSDKConsumer from './NotificationsSDKConsumer';

export default class NotificationsSDKProvider {

  _consumer: NotificationsSDKConsumer;

  constructor() {
    this._consumer = new NotificationsSDKConsumer(this);
  }

  get consumer(): NotificationsSDKConsumer {
    return this._consumer;
  }

  callNew(...args: any[]) {
    return this.consumer.call('new', ...args);
  }
}
