import * as ReconnectingWebSocket from 'reconnecting-websocket';
import * as WS from 'ws';

export interface ReconnectOptions {
  [key: string]: any;
  constructor?: new (url: string, protocols?: string | string[]) => WS;
  maxReconnectionDelay?: number;
  minReconnectionDelay?: number;
  reconnectionDelayGrowFactor?: number;
  connectionTimeout?: number;
  maxRetries?: number;
  debug?: boolean;
}

class SafeWS extends WS {
  private opened: boolean;

  constructor(url: string, protocols?: string | string[]) {
    super(url, protocols);
    this.opened = false;
    this.addEventListener('open', () => {
      this.opened = true;
    });
    this.addEventListener('close', () => {
      this.opened = false;
    });
  }

  close() {
    if (this.opened) {
      super.close();
    }
  }
}

export default class WebSocketClient {
  static from(url: string, protocols?: string | string[], options: ReconnectOptions = {
    constructor: SafeWS,
    maxRetries: 10,
  }): WS {
    // @ts-ignore ReconnectingWebSocket typing is quite broken
    return new ReconnectingWebSocket(url, protocols, options);
  }
}
