import { app } from 'electron';
import { ServiceSubscription } from '../../lib/class';
import { RPC } from '../../lib/types';
import { SkeletonService, SkeletonServiceObserver } from './interface';

export class SkeletonServiceImpl extends SkeletonService implements RPC.Interface<SkeletonService> {

  async getName() {
    await app.whenReady();
    return app.name;
  }

  async addObserver(obs: RPC.ObserverNode<SkeletonServiceObserver>) {
    if (obs.onTest) {
      obs.onTest({
        test: 'DummyService addObserver onTest called',
      });
    }
    return ServiceSubscription.noop;
  }
}
