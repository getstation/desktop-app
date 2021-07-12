import { ServiceBase } from '../../lib/class';
import { service } from '../../lib/decorator';
import { RPC } from '../../lib/types';

@service('change-this-namespace-yoooooooo')
export class SkeletonService extends ServiceBase implements RPC.Interface<SkeletonService> {
  // @ts-ignore
  getName(): Promise<string> {}
  // @ts-ignore
  addObserver(obs: RPC.ObserverNode<SkeletonServiceObserver>): Promise<RPC.Subscription> {}
}

@service('change-this-namespace-yoooooooo')
export class SkeletonServiceObserver extends ServiceBase implements RPC.Interface<SkeletonServiceObserver> {
  // @ts-ignore
  onTest<T>(param: { test: T }): void {}
}
