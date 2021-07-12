import * as Promise from 'bluebird';

import SlackSDKProvider, { SlackToken } from './SlackSDKProvider';

class SlackSDKConsumer {
  // reference to current provider
  provider: SlackSDKProvider;
  constructor(provider: SlackSDKProvider) {
    this.provider = provider;
  }

  /**
   * Get the token of the loaded Slack instances
   */
  getAPITokens(): Promise<SlackToken[]> {
    const request = new Promise<SlackToken[]>((resolve, reject) => {
      this.provider.emit('api-token-request', resolve, reject);
    });

    return request.timeout(1000);
  }
}

export default SlackSDKConsumer;
