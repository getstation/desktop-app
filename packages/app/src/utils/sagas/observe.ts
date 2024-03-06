import {
  select,
  take,
  fork,
} from 'redux-saga/effects';

type SelectorFn<S, R> = (state: S) => R;
type WorkerFn<R> = (current: R, previous: R, ...args: any[]) => any;
// [H, I, ...T] -> T
type Tail<L extends any[]> = ((...l: L) => any) extends ((h: any, i: any, ...t: infer T) => any) ? T : never;
/**
 * Spawns a `saga` when the result of the given selector changes.
 *
 * Usage:
 *  ```js
 * yield observe(getToken, function*(currentToken, previousToken) {
 *  // do things
 * })
 * ```
 */
export function observe<S, R, Fn extends WorkerFn<R>>(
  selector: SelectorFn<S, R>,
  worker: Fn,
  ...args: Tail<Parameters<Fn>>
) {
  return fork(function* () {
    let previous = null;

    while (true) {
      yield take('*');
      const current = yield select(selector);
      if (current !== previous) {
        // @ts-ignore https://github.com/redux-saga/redux-saga/issues/1482
        yield fork(worker, current, previous, ...args);
      }
      previous = current;
    }
  });
}
