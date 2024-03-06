import { ServiceBase } from '../../../../src/services/lib/class';
import { service } from '../../../../src/services/lib/decorator';
import { RPC } from '../../../../src/services/lib/types';

@service('test')
export class TestService extends ServiceBase implements RPC.Interface<TestService> {
  // @ts-ignore
  getName(): Promise<string> {}
  // @ts-ignore
  throwError(): Promise<void> {}
  // @ts-ignore
  reduceAdd(...numbers: number[]): Promise<number> {}
  // @ts-ignore
  addObserver(obs: RPC.ObserverNode<TestServiceObserver>): Promise<RPC.Subscription> {}
  // @ts-ignore
  setProvider(provider: RPC.Node<TestServiceProvider>): Promise<void> {}
  // @ts-ignore
  getValueFromProvider(): Promise<string> {}
}

@service('test')
export class TestServiceObserver extends ServiceBase implements RPC.Interface<TestServiceObserver> {
  // @ts-ignore
  onTest<T>(param: { test: T }): void {}
}

@service('test')
export class TestServiceProvider extends ServiceBase implements RPC.Interface<TestServiceProvider> {
  // @ts-ignore
  whoAmI(): Promise<string> {}
}
