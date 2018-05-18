import * as Rx from 'rxjs/Rx';
import { SearchConsumer } from './search/consumer';
import { StorageConsumer } from './storage/consumer';
import { TabsConsumer } from './tabs/consumer';

export type Consumers = SearchConsumer | StorageConsumer | TabsConsumer;
export interface ConsumerRegistration<C extends Consumers> {
  namespace: C['namespace'],
  register?: C,
  unregister?: C,
}

export const consumersObservable = new Rx.Subject<ConsumerRegistration<Consumers>>();

export function register<C extends Consumers>(consumer: C): C {
  consumersObservable.next({
    namespace: consumer.namespace,
    register: consumer,
  });
  return consumer;
}

export function unregister<C extends Consumers>(consumer: C): C {
  consumersObservable.next({
    namespace: consumer.namespace,
    unregister: consumer,
  });
  return consumer;
}
