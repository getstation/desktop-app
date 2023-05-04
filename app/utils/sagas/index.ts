import log from 'electron-log';
import { EventEmitter } from 'events';
import { buffers, Channel, END, eventChannel, TakeableChannel } from 'redux-saga';
import {
  call,
  cancel,
  delay,
  fork,
  ForkEffect,
  Pattern,
  put,
  race,
  take,
  TakeEffect,
  takeEvery,
  takeLatest,
  throttle,
} from 'redux-saga/effects';
import { Observable } from 'rxjs/Observable';
import * as shortid from 'shortid';
import { logger } from '../../api/logger';
import { ERROR, error, ErrorAction, FIN, fin, FinAction } from '../../plugins/duck';
import { observer } from '../../services/lib/helpers';
import { RPC } from '../../services/lib/types';
import { TabWebContentsService } from '../../services/services/tab-webcontents/interface';
import services from '../../services/servicesManager';
import { GlobalServices } from '../../services/types';

export function tryCatch<Fn extends (...args: any[]) => any>(saga: Fn /* vk: CallEffectFn<any> */) {
  // Inspired by https://github.com/cyrilluce/redux-saga-catch
  // @author cyrilluce@gmail.com
  return function* wrappedTryCatch(...args: any[]) {
    try {
      yield call(saga, ...args);
    } catch (e) {
      log.error(e);
      logger.notify(e);
    }
  };
}

export function takeFirstWitness(pattern: Pattern | TakeableChannel, worker: Function, ...args: any[]): ForkEffect {
  return fork(function* () {
    const action = yield take(pattern);
    yield call(tryCatch(worker), ...args.concat(action));
  });
}

export function takeEveryWitness(pattern: Pattern | TakeableChannel, worker: Function, ...args: any[]): ForkEffect {
  return takeEvery(pattern, tryCatch(worker), ...args);
}

export function takeLatestWitness(pattern: Pattern | TakeableChannel, worker: Function, ...args: any[]): ForkEffect {
  return takeLatest(pattern, tryCatch(worker), ...args);
}

/**
 * Spawns a saga on each action dispatched to the Store that matches pattern.
 * After spawning a task once, it blocks until spawned saga completes and then starts to listen for a pattern again.
 * In short, it is listening for the actions when it doesn't run a saga.
 */
export function takeLeadingWitness(pattern: Pattern | TakeableChannel, worker: Function, ...args: any[]): ForkEffect {
  return fork(function* () {
    while (true) {
      const action = yield take(pattern);
      yield call(tryCatch(worker), ...args.concat(action));
    }
  });
}

export function takeComplexLatestWitness(
  pattern: Pattern | TakeableChannel,
  getUnicityKey: Function,
  worker: CallEffectFn<any>,
  ...args: any[]
): ForkEffect {
  return fork(function* () {
    const lastTaskMap = new Map();
    while (true) {
      const action = yield take(pattern);
      const uniq = getUnicityKey(action);
      if (lastTaskMap.has(uniq)) {
        yield cancel(lastTaskMap.get(uniq)); // cancel is no-op if the task has already terminated
        lastTaskMap.delete(uniq);
      }
      lastTaskMap.set(uniq, yield fork(tryCatch(worker), ...args.concat(action)));
    }
  });
}

export function throttleWitness(ms: number, pattern: Pattern | TakeableChannel, worker: Function, ...args: any[]): ForkEffect {
  return throttle(ms, pattern, tryCatch(worker), ...args);
}

// Custom utils

export function createEmitterEventChannel(
  eventEmitter: EventEmitter,
  paramEventNames: string | string[],
  endEventName?: string,
): Channel<any> {
  return eventChannel(emit => {
    const eventHandler = (...args: any[]) => emit(args);
    let eventNames = paramEventNames;

    if (!Array.isArray(eventNames)) {
      eventNames = [eventNames];
    }

    for (const eventName of eventNames) {
      eventEmitter.on(eventName, eventHandler);
    }
    if (endEventName) eventEmitter.on(endEventName, () => emit(END));

    // the subscriber must return an unsubscribe function
    return () => {
      for (const eventName of eventNames) {
        eventEmitter.removeListener(eventName, eventHandler);
      }
    };
  });
}

export function observableChannel<C extends Observable<R>, R>(observable: C): Channel<R> {
  return eventChannel(
    ((emitter) => {
      const subscription = observable.subscribe({
        next: (value: R) => emitter(value),
        complete: () => emitter(END),
        error: err => emitter(err),
      });

      return subscription.unsubscribe.bind(subscription);
    }),
    buffers.expanding()
  );
}

export function periodicTick(ms: number, stopAfter?: number): Channel<any> {
  return eventChannel((emit) => {
    let total = 0;
    const iv = setInterval(() => {
      total += ms;
      if (stopAfter && stopAfter <= total) {
        emit(END);
      } else {
        emit({});
      }
    }, ms);
    return () => clearInterval(iv);
  });
}

export type GenericCallEffectFn = CallEffectFn<(...args: any[]) => any>;

function tryCatchAck(saga: Function) {
  return function* wrappedTryCatch(...args: any[]) {
    const [{ __ack_id }] = args;
    try {
      yield* saga(...args);
      yield put(fin(__ack_id));
    } catch (e) {
      log.error(e);
      logger.notify(e);
      yield put(error(__ack_id));
    }
  };
}

export function takeEveryWithAck(pattern: Pattern | TakeableChannel, worker: Function, ...args: any[]): ForkEffect {
  return takeEvery(pattern, tryCatchAck(worker), ...args);
}

export function wrapAck(action: any) {
  return {
    ...action,
    __ack_id: shortid.generate(),
  };
}

export function* putAck(action: any, worker: CallEffectFn<any>, errorWorker?: CallEffectFn<any>) {
  const ackAction = wrapAck(action);
  yield put(ackAction);

  const raceResult = yield race({
    fin: take((act: FinAction) => act.type === FIN && act.id === ackAction.__ack_id),
    error: take((act: ErrorAction) => act.type === ERROR && act.id === ackAction.__ack_id),
  });

  if (raceResult.fin) {
    yield call(worker);
  } else if (raceResult.error && errorWorker) {
    yield call(errorWorker);
  }
}

/**
 * Debounce a saga for X milliseconds
 *
 * @param {Number} ms
 * @param {String|Array|Function} pattern
 * @param {Function} saga
 * @param {Array} args
 */
export function* debounceFor(ms: number, pattern: Pattern | TakeableChannel, saga: Function, ...args: any[]) {
  function* delayedSaga(action: TakeEffect) {
    yield call(delay, ms);
    yield call<TakeEffect, any>(saga, action, ...args);
  }

  let task;
  while (true) {
    const action = yield take(pattern);
    if (task) {
      yield cancel(task);
    }

    task = yield fork(delayedSaga, action);
  }
}

type IsFunctionWithArgs<T> = T extends (...args: any[]) => any ? T : never;

export function callService<
    K extends keyof GlobalServices,
    M extends keyof GlobalServices[K],
    P extends Parameters<IsFunctionWithArgs<GlobalServices[K][M]>>,
  >(service: K, method: M, ...params: P) {
  return call([services[service], services[service][method as string]], ...params);
}

type NodeWithObserver<T extends RPC.ObserverNode<T>, M extends string> = {
  [key in M]: (param: T) => Promise<RPC.Subscription>;
};

type ObserverFromWebContents<I> = I extends ((webContentsId: number, param: infer T) => Promise<RPC.Subscription>) ? T : never;
type FirstParamOrEmpty<T> = Parameters<IsFunctionWithArgs<T>>[0] extends undefined ? {} : Parameters<IsFunctionWithArgs<T>>[0];

export function createServiceObserverChannel
<M extends string>(methodName: M) {
  return <T extends RPC.ObserverNode<T>, K extends keyof T>(
    service: NodeWithObserver<T, M>,
    observerMethodName: K,
    prefix?: string,
    ): Channel<FirstParamOrEmpty<T[K]>> => {
    return eventChannel(
      ((emitter) => {
        const obs = {
          [observerMethodName]: (arg: Parameters<IsFunctionWithArgs<T[K]>>[0]) => {
            emitter(arg === undefined ? {} : arg);
          },
        };
        const sub = service[methodName](observer(obs as any, prefix));
        sub.then((x: any) => {
          x.emitter.once('destroyed', () => {
            emitter(END);
          });
        });
        return () => sub.then(x => x.unsubscribe());
      }),
    );
  };
}

type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends ((webContentsId: number, obs: any) => any) ? K : never }[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

export function createWebContentsServiceObserverChannel
<
  M extends keyof FunctionProperties<TabWebContentsService>,
  O extends ObserverFromWebContents<TabWebContentsService[M]>,
  K extends keyof O,
  >(webContentsId: number,
    methodName: M,
    observerMethodName: K,
    prefix?: string): Channel<FirstParamOrEmpty<O[K]>> {
  return eventChannel(
    ((emitter) => {
      const obsParams = {
        [observerMethodName]: (arg: Parameters<IsFunctionWithArgs<O[K]>>[0]) => {
          emitter(arg === undefined ? {} : arg);
        },
      };
      const obs = observer(obsParams as any, prefix);
      const sub: Promise<RPC.Node<RPC.Subscription>> =
        (services.tabWebContents as any)[methodName](webContentsId, obs);
      sub.then((x: any) => {
        x.emitter.once('destroyed', () => {
          emitter(END);
        });
      });
      return () => sub.then(x => x.unsubscribe());
    }),
  );
}

export const serviceAddObserverChannel = createServiceObserverChannel('addObserver');
