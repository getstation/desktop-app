import { RPCChannelPeer } from 'stream-json-rpc';
import { ServiceBase, ServicePeer, ServiceSubscription } from '../../../src/services/lib/class';
import { service } from '../../../src/services/lib/decorator';
import { RPC } from '../../../src/services/lib/types';

@service('test')
export class TestService extends ServiceBase implements RPC.Interface<TestService> {
  // @ts-ignore
  getName(): Promise<string> {}
  // @ts-ignore
  throwError(): Promise<void> {}
  // @ts-ignore
  addObserver(obs: RPC.ObserverNode<TestServiceObserver>): Promise<RPC.Subscription> {}
}

@service('test')
export class TestServiceObserver extends ServiceBase implements RPC.Interface<TestServiceObserver> {
  // @ts-ignore
  onTest<T>(param: { test: T }): void {}
}

export class TestServiceImpl extends TestService implements RPC.Interface<TestService> {

  async getName() {
    return 'test';
  }

  async throwError() {
    throw new Error('This is an error');
  }

  async addObserver(obs: RPC.ObserverNode<TestServiceObserver>) {
    if (obs.onTest) {
      obs.onTest({
        test: 'TestService addObserver onTest called',
      });
    }
    return ServiceSubscription.noop;
  }
}

export const getPeerMock = jest.fn(() => ({
  request: jest.fn((key: string) => {
    switch (key) {
      case 'test:getName':
        return Promise.resolve([JSON.stringify('test')]);
    }
    throw new Error(`Unknown key ${key}`);
  }),
  notify: jest.fn(),
  setRequestHandler: jest.fn(),
  on: jest.fn(),
  setMaxListeners: jest.fn(),
}));

export const setPeer = (node: ServiceBase, peerMock: RPCChannelPeer) => {
  (node as unknown as ServicePeer).peer = peerMock;
};

export const getChannelMock = () => {
  return {
    peer: getPeerMock,
  };
};
