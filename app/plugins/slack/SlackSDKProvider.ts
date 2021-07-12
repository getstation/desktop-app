import { EventEmitter } from 'events';

import SlackSDKConsumer from './SlackSDKConsumer';

export interface SlackToken {
  doamin: string;
  token: string;
}

interface SlackSDKProvider {
  on(
    event: 'api-token-request',
    listener: (
      resolve: (tokens: SlackToken[]) => any,
      reject: () => any) => any
    ): this
}

class SlackSDKProvider extends EventEmitter {
  _consumer: SlackSDKConsumer;

  constructor() {
    super();
    this._consumer = new SlackSDKConsumer(this);
  }

  get consumer(): SlackSDKConsumer {
    return this._consumer;
  }

}

export default SlackSDKProvider;
