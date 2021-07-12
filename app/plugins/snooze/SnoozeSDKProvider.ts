import SnoozeSDKConsumer from './SnoozeSDKConsumer';

export default class SnoozeSDKProvider {

  _consumer: SnoozeSDKConsumer;

  constructor() {
    this._consumer = new SnoozeSDKConsumer(this);
  }

  get consumer(): SnoozeSDKConsumer {
    return this._consumer;
  }

  triggerSet(duration: string) {
    this.consumer.emit('set', duration);
  }

  triggerReset() {
    this.consumer.emit('reset');
  }
}
