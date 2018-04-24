import * as Rx from 'rxjs/Rx';
import { search } from './search';

export type ConsumerRegistration = search.SearchConsumerRegistration;
export type Consumers = search.SearchConsumer;

export const consumersObservable = new Rx.Subject<ConsumerRegistration>();

export function register(consumer: Consumers) {
  consumersObservable.next({
    namespace: consumer.namespace,
    register: consumer,
  });
}

export function unregister(consumer: Consumers) {
  consumersObservable.next({
    namespace: consumer.namespace,
    unregister: consumer,
  });
}
