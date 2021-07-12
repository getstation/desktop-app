import log from 'electron-log';
import { Store } from 'redux';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx';
import { logger } from '../api/logger';

type Selector<S, R> = (state: S) => R;
export function subscribeStore<S, R>(store: Store<S>, selector?: Selector<S, R>) {
  return new Observable<S>((observer) => {
    // emit the first value immediately
    observer.next(store.getState());

    return store.subscribe(() => {
      // `observer.next` is synchronous. It means that any error occurring in the pipeline
      // of this observable will be bubbled here if not caught before.
      // If this happens, current `subscribe` tick will also fail (also synchronous), and all
      // middleware that should have been executed after this observer will not be executed.
      try {
        observer.next(store.getState());
      } catch (e) {
        log.error(e);
        logger.notify(e);
      }
    });
  }).pipe(map((state) => selector ? selector(state) : state))
    .pipe(distinctUntilChanged<R>());
}
