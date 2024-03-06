import * as Immutable from 'immutable';
import * as Redux from 'redux';
import { Persistor } from 'redux-persist';
import { SagaMiddleware } from 'redux-saga';
import { StationRawState } from './state';

export { StationRawState };

export type StationState = RecursiveImmutableMap<StationRawState>;
export type StationStore = Redux.Store<StationState>;
export type StationStoreWorker = StationStore & {
  runSaga: SagaMiddleware<StationState>['run'];
  persistor: Persistor;
  ready: () => Promise<void>;
};

export type JSSClasses<T> = Record<keyof T, string>;

export type WithDefault<X, Y> = X extends undefined ? (Y extends undefined ? X : NonNullable<X>) : X;

export interface FnGet<TProps> {
  <K extends keyof TProps, V extends TProps[K] | undefined = undefined>(
    key: K, notSetValue?: V
  ): WithDefault<TProps[K], V>;
}

export interface FnSet<TProps, Context> {
  <K extends keyof TProps, V extends TProps[K]>(
    key: K, value: V
  ): Context;
}

// FIXME: - If one the item is nullable, result could be undefined
export interface FnGetIn<TProps> {
  <
    K1 extends keyof TProps,
    O2 extends TProps[K1],
    V extends O2 | undefined = undefined
    >
  (a: [K1], notSetValue?: O2): WithDefault<O2, V>;

  <
    K1 extends keyof TProps,
    O2 extends TProps[K1],
    K2 extends keyof NonNullable<ImmutableToObject<O2>>,
    O3 extends NonNullable<ImmutableToObject<O2>>[K2],
    V extends O3 | undefined = undefined
    >
  (a: [K1, K2], notSetValue?: V): WithDefault<O3, V>;

  <
    K1 extends keyof TProps,
    O2 extends TProps[K1],
    K2 extends keyof NonNullable<ImmutableToObject<O2>>,
    O3 extends NonNullable<ImmutableToObject<O2>>[K2],
    K3 extends keyof NonNullable<ImmutableToObject<O3>>,
    O4 extends NonNullable<ImmutableToObject<O3>>[K3],
    V extends O4 | undefined = undefined
    >
  (a: [K1, K2, K3], notSetValue?: V): WithDefault<O4, V>;

  <
    K1 extends keyof TProps,
    O2 extends TProps[K1],
    K2 extends keyof NonNullable<ImmutableToObject<O2>>,
    O3 extends NonNullable<ImmutableToObject<O2>>[K2],
    K3 extends keyof NonNullable<ImmutableToObject<O3>>,
    O4 extends NonNullable<ImmutableToObject<O3>>[K3],
    K4 extends keyof NonNullable<ImmutableToObject<O4>>,
    O5 extends NonNullable<ImmutableToObject<O4>>[K4],
    V extends O5 | undefined = undefined
    >
  (a: [K1, K2, K3, K4], notSetValue?: V): WithDefault<O5, V>;

  // copied from ImmutableJS definition file
  (searchKeyPath: Immutable.Iterable<any, any>, notSetValue?: any): any;
}

export interface FnSetIn<TProps, Context> {
  <
    K1 extends keyof TProps,
    O2 extends TProps[K1],
    >
  (a: [K1], value: O2): Context;

  <
    K1 extends keyof TProps,
    O2 extends TProps[K1],
    K2 extends keyof NonNullable<ImmutableToObject<O2>>,
    O3 extends NonNullable<ImmutableToObject<O2>>[K2]
    >
  (a: [K1, K2], value: O3): Context;

  <
    K1 extends keyof TProps,
    O2 extends TProps[K1],
    K2 extends keyof NonNullable<ImmutableToObject<O2>>,
    O3 extends NonNullable<ImmutableToObject<O2>>[K2],
    K3 extends keyof NonNullable<ImmutableToObject<O3>>,
    O4 extends NonNullable<ImmutableToObject<O3>>[K3]
    >
  (a: [K1, K2, K3], value: O4): Context;

  <
    K1 extends keyof TProps,
    O2 extends TProps[K1],
    K2 extends keyof NonNullable<ImmutableToObject<O2>>,
    O3 extends NonNullable<ImmutableToObject<O2>>[K2],
    K3 extends keyof NonNullable<ImmutableToObject<O3>>,
    O4 extends NonNullable<ImmutableToObject<O3>>[K3],
    K4 extends keyof NonNullable<ImmutableToObject<O4>>,
    O5 extends NonNullable<ImmutableToObject<O4>>[K4]
    >
  (a: [K1, K2, K3, K4], value: O5): Context;

  // inspired from ImmutableJS definition file
  (searchKeyPath: Immutable.Iterable<any, any>, value: any): Context;
}

// There is no distinction between 'missing' and 'undefined' values for now
// @see https://github.com/Microsoft/TypeScript/issues/13195
// So to simplify, functions like sort/filter/map/etc. assume that their values are `NonNullable`
export interface FnSortBy<T, Context> {
  <C>(
    comparatorValueMapper: (value: NonNullable<ValueOfKeys<T>>, key?: Keys<T>, iter?: Context) => C,
    comparator: (valueA: C, valueB: C) => number
  ): Context;
  <C>(
    comparatorValueMapper: (value: NonNullable<ValueOfKeys<T>>, key?: Keys<T>, iter?: Context) => NonNullable<C>,
  ): Context;
}

export interface FnRemove<T, Context> {
  (key: Keys<T>): Context;
}

export interface FnFilter<T, Context> {
  (
    predicate: (value: NonNullable<ValueOfKeys<T>>, key?: Keys<T>, iter?: Context) => boolean,
    context?: any
  ): Context;
}

export interface FnEvery<T, Context> {
  (
    predicate: (value: NonNullable<ValueOfKeys<T>>, key?: Keys<T>, iter?: Context) => boolean,
    context?: any
  ): boolean;
}

export interface FnMap<T, Context> {
  <M>(
    mapper: (value: NonNullable<ValueOfKeys<T>>, key?: Keys<T>, iter?: Context) => M,
    context?: any
  ): InheritImmutable<Context, M>;
}

export interface ImmutableList<T extends any[]> extends Immutable.List<T[number]> {
  get: FnGet<T>;
  set: FnSet<T, this>;
  getIn: FnGetIn<T>;
  setIn: FnSetIn<T, this>;
  toJS: () => RecursiveImmutableToObject<T>;
  sortBy: FnSortBy<T, this>;
  filter: FnFilter<T, this>;
  every: FnEvery<T, this>;
  map: FnMap<T, this>;
  remove: FnRemove<T, this>;
  delete: FnRemove<T, this>;
}

export interface ImmutableMap<T> extends Omit<Immutable.Map<any, any>, keyof ImmutableMap<T>> {
  get: FnGet<T>;
  set: FnSet<T, this>;
  getIn: FnGetIn<T>;
  setIn: FnSetIn<T, this>;
  mergeIn: FnSetIn<T, this>;
  toJS: () => RecursiveImmutableToObject<T>;
  sortBy: FnSortBy<T, this>;
  toList: () => ImmutableList<NonNullable<ValueOfKeys<T>>[]>;
  filter: FnFilter<T, this>;
  every: FnEvery<T, this>;
  map: FnMap<T, this>;
  remove: FnRemove<T, this>;
  delete: FnRemove<T, this>;
}

export type Omit<T, K extends keyof T> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;

export type ObjectToImmutable<T> =
  T extends any[] ? ImmutableList<T> :
    T extends object ? ImmutableMap<T> :
      T;

export type RecursiveObjectToImmutable<T> =
  T extends any[] ? RecursiveImmutableList<T> :
    T extends object ? RecursiveImmutableMap<T> :
      T;

export type InnerRecursiveImmutableMap<T> = {
  [K in keyof T]: T[K] extends Function ? T[K] : RecursiveObjectToImmutable<T[K]>;
};

export type RecursiveImmutableMap<T> = ImmutableMap<InnerRecursiveImmutableMap<T>>;

export interface RecursiveImmutableList<T extends any[]> extends ImmutableList<RecursiveObjectToImmutable<T[number]>[]> {}

type Keys<T> = T extends any[] ? number : keyof T;

type ValueOfKeys<T> = T extends any[] ? T[number] : T[keyof T];

type ImmutableToObject<T> =
  T extends ImmutableList<infer C> ? C :
    T extends ImmutableMap<infer D> ? D :
      T;

type RecursiveImmutableToObject<T> =
  T extends RecursiveImmutableList<infer C> ? RecursiveImmutableToObject2<C> :
    T extends RecursiveImmutableMap<infer D> ? RecursiveImmutableToObject2<D> :
      T extends ImmutableList<infer A> ? RecursiveImmutableToObject2<A> :
        T extends ImmutableMap<infer B> ? RecursiveImmutableToObject2<B> :
          T extends InnerRecursiveImmutableMap<infer E> ? RecursiveImmutableToObject2<E> :
            T;

type RecursiveImmutableToObject2<T> =
  T extends RecursiveImmutableList<infer C> ? RecursiveImmutableToObject3<C> :
    T extends RecursiveImmutableMap<infer D> ? RecursiveImmutableToObject3<D> :
      T extends ImmutableList<infer A> ? RecursiveImmutableToObject3<A> :
        T extends ImmutableMap<infer B> ? RecursiveImmutableToObject3<B> :
          T extends InnerRecursiveImmutableMap<infer E> ? RecursiveImmutableToObject3<E> :
            T;

type RecursiveImmutableToObject3<T> =
  T extends RecursiveImmutableList<infer C> ? RecursiveImmutableToObject4<C> :
    T extends RecursiveImmutableMap<infer D> ? RecursiveImmutableToObject4<D> :
      T extends ImmutableList<infer A> ? RecursiveImmutableToObject4<A> :
        T extends ImmutableMap<infer B> ? RecursiveImmutableToObject4<B> :
          T extends InnerRecursiveImmutableMap<infer E> ? RecursiveImmutableToObject4<E> :
            T;

type RecursiveImmutableToObject4<T> =
  T extends RecursiveImmutableList<infer C> ? ImmutableToObject<C> :
    T extends RecursiveImmutableMap<infer D> ? ImmutableToObject<D> :
      T extends ImmutableList<infer A> ? ImmutableToObject<A> :
        T extends ImmutableMap<infer B> ? ImmutableToObject<B> :
          T extends InnerRecursiveImmutableMap<infer E> ? ImmutableToObject<E> :
            T;

type InheritImmutable<T, C> =
  T extends ImmutableList<any> ? ImmutableList<C[]> :
    T extends ImmutableMap<any> ? ImmutableMap<C> :
      C;

export type FromJS = <T>(o: T) => RecursiveObjectToImmutable<T>;
