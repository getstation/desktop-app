import { Consumer } from '@getstation/sdk';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export abstract class AbstractProvider<C extends Consumer> {
  public consumersObservable: BehaviorSubject<C[]>;
  protected _consumers: C[] = [];
  protected subscriptionMap = new WeakMap<C, Function>();

  // Let this constructor public to avoid compilation errors
  constructor() {
    this.consumersObservable = new BehaviorSubject([]);
  }

  public abstract addConsumer(consumer: C): void;

  public removeConsumer(consumer: C) {
    const index = this._consumers.indexOf(consumer);
    if (index > -1) {
      this._consumers.splice(index, 1);
      this.consumersObservable.next(this._consumers);
    }
    this.unsubscribeConsumer(consumer);
  }

  protected pushConsumer(consumer: C) {
    this._consumers.push(consumer);
    this.consumersObservable.next(this._consumers);
  }

  protected subscribeConsumer(consumer: C, unsubscribe: Function) {
    this.subscriptionMap.set(consumer, unsubscribe);
  }

  protected unsubscribeConsumer(consumer: C) {
    const unsubscribe = this.subscriptionMap.get(consumer);
    if (unsubscribe) unsubscribe();
  }
}

/**
 * Dynamically create values upon get() if they do not exists
 */
export class DefaultMap<K, V> extends Map<K, V> {

  protected defaultValueFactory: Function;

  constructor(defaultValueFactory: Function, entries?: ReadonlyArray<[K, V]>) {
    super(entries);
    this.defaultValueFactory = defaultValueFactory;
  }

  get(key: K): V {
    if (!super.has(key)) {
      super.set(key, this.defaultValueFactory(key));
    }
    return super.get(key)!;
  }
}
