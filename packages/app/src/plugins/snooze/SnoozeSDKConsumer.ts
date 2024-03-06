import SnoozeSDKProvider from './SnoozeSDKProvider';

import { EventEmitter } from 'events';

declare interface SnoozeSDKConsumer {
  /**
   * Emitted when the snooze is set
   */
  on(event: 'set', listener: (duration: string) => any): this
  /**
   * Emitted when the snooze is reset
   */
  on(event: 'reset', listener: () => any): this
}

class SnoozeSDKConsumer extends EventEmitter {
  // reference to current provider
  provider: SnoozeSDKProvider;

  constructor(provider: SnoozeSDKProvider) {
    super();
    this.provider = provider;
  }
}

export default SnoozeSDKConsumer;
