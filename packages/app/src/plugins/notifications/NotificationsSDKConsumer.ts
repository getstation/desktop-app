import mware, { Event } from 'mware-ts';
import { NewNotificationAction } from '../../notification-center/duck';
import NotificationsSDKProvider from './NotificationsSDKProvider';

declare interface NotificationsSDKConsumer {
  intercept(event: 'new', listener: (e: Event, action: NewNotificationAction) => any): this
  intercept(event: 'show', listener: () => any): this // TODO
  intercept(event: 'click', listener: () => any): this // TODO
  intercept(event: 'close', listener: () => any): this // TODO
}

class NotificationsSDKConsumer {
  // reference to current provider
  provider: NotificationsSDKProvider;
  _events: Map<string, {
    use: Function,
    run: Function,
  }>;

  constructor(provider: NotificationsSDKProvider) {
    this.provider = provider;
    this._events = new Map();
  }

  intercept(eventName: string, listener: Function) {
    if (!this._events.has(eventName)) {
      this._events.set(eventName, mware());
    }
    this._events.get(eventName)!.use(listener);
    return this;
  }

  call(eventName: string, ...args: any[]) {
    const event = new Event(eventName);
    if (!this._events.has(eventName)) {
      return [event, ...args];
    }
    return this._events.get(eventName)!.run(event, ...args);
  }
}

export default NotificationsSDKConsumer;
