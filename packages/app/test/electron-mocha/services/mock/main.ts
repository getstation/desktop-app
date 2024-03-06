import { ServiceSubscription } from '../../../../src/services/lib/class';
import { RPC } from '../../../../src/services/lib/types';
import { TestService, TestServiceObserver, TestServiceProvider } from './common';

export class TestServiceImpl extends TestService implements RPC.Interface<TestService> {

  provider: RPC.Node<TestServiceProvider>;

  async getName() {
    return 'test';
  }

  async throwError() {
    throw new Error('This is an error');
  }

  async reduceAdd(...numbers: number[]) {
    return numbers.reduce((p, c) => p + c, 0);
  }

  async addObserver(obs: RPC.ObserverNode<TestServiceObserver>) {
    if (obs.onTest) {
      obs.onTest({
        test: 'TestService addObserver onTest called',
      });
    }
    return ServiceSubscription.noop;
  }

  async setProvider(provider: RPC.Node<TestServiceProvider>) {
    this.provider = provider;
  }

  async getValueFromProvider() {
    const resp = await this.provider.whoAmI();
    return `I am ${resp}`;
  }
}
