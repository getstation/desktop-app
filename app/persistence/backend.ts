import * as BluebirdPromise from 'bluebird';
import * as Immutable from 'immutable';
import * as Sequelize from 'sequelize';
import { KeyValueProxy, ListProxy, MapProxy, SingletonProxy } from './mixins'; // We need this for cancellable Promises

BluebirdPromise.config({
  longStackTraces: true,
  cancellation: true,
});

export const DELAY = process.env.NODE_ENV === 'test' ? 0 : 1000;

const addErrorDetails = (err: Error, message: string) => {
  // eslint-disable-next-line no-param-reassign
  err.message = `${message}.
Details: ${err.message}`;
  return err;
};

export interface StateProxy<T> {
  get(): Promise<T>
  set(state: T): Promise<void>
  actualSet?(state: T): Promise<void>
}

abstract class AbstractStateProxy<T> {
  protected delayed: BluebirdPromise<any>[] = [];

  async set(state: T, delay: number = DELAY) {
    this.cancelDelayed();
    const delayed = BluebirdPromise.delay(delay);
    this.delayed.push(delayed);
    return new Promise((resolve, reject) => {
      delayed
        .then(() => this.actualSet(state))
        .then(() => resolve())
        .catch(reject)
        .finally(() => {
          const index = this.delayed.indexOf(delayed);
          if (index !== -1) {
            this.delayed.splice(index, 1);
          }
          if (delayed.isCancelled()) {
            resolve();
          }
        });
    });
  }

  async actualSet(_state: T) {
    throw new Error('actualSet must be overridden');
  }

  protected cancelDelayed() {
    let p: BluebirdPromise<any> | undefined;
    for (let i = 0; i < this.delayed.length; i += 1) {
      p = this.delayed.shift();
      if (p) p.cancel();
    }
  }
}

/**
 * This class is a helper to load/save simple state elements like 'app'
 */
export class SingletonStateProxy<S extends Sequelize.Instance<any>, T extends SingletonProxy<S> = SingletonProxy<S>>
  extends AbstractStateProxy<Immutable.Map<string, any>> implements StateProxy<Immutable.Map<string, any>> {

  protected aclass: { new(): T };
  protected instance: T | null;

  constructor(aclass: { new(): T }) {
    super();
    this.aclass = aclass;
    this.instance = null;
  }

  clear() {
    this.instance = null;
  }

  async toState(): Promise<Immutable.Map<string, any>> {
    if (!this.instance) return Immutable.Map();
    const state = await this.instance.toState();
    if (!state) return Immutable.Map();
    return state;
  }

  async init() {
    if (!this.instance) {
      return this.aclass.getOne().then((instance: T) => {
        this.instance = instance;
        return;
      });
    }
  }

  async get() {
    if (!this.instance) {
      return this.aclass.getOne().then((instance: T) => {
        this.instance = instance;
        return this.toState();
      });
    }
    return this.toState();
  }

  async actualSet(state: Immutable.Map<string, any>) {
    await this.init();
    if (this.instance!.isEmpty()) {
      // Do not insert empty singleton
      if (state.size === 0) return;
      this.instance = await this.aclass.create(state);
    } else if (state.size === 0) {
      // Was not empty in db, be now empty in state,
      // so we must delete reference from db
      await this.aclass.truncate();
      this.clear();
    } else {
      this.instance = await this.instance!.update(state);
    }
    return;
  }
}

/**
 * This class is a helper to load/save ordered list state elements like 'dock'
 */
export class ListStateProxy<S extends Sequelize.Instance<any>, T extends ListProxy<S> = ListProxy<S>>
  extends AbstractStateProxy<Immutable.List<any>> implements StateProxy<Immutable.List<any>> {

  protected aclass: { new(): T };
  protected instances: T[] | null;

  constructor(aclass: { new(): T }) {
    super();
    this.aclass = aclass;
    this.instances = null;
  }

  clear() {
    this.instances = null;
  }

  toState(): Promise<Immutable.List<any>> {
    return this.aclass.toState(this.instances);
  }

  async get() {
    if (!this.instances) {
      return this.aclass.getAll().then((instances: T[]) => {
        this.instances = instances;
        return this.toState();
      });
    }
    return this.toState();
  }

  async actualSet(state: Immutable.List<any>) {
    if (this.instances) {
      const currentList = await this.get();
      if (state.equals(currentList)) return;
      await this.aclass.truncate();
    }
    this.instances = await this.aclass.createAll(state);
    return;
  }
}

/**
 * This class is a helper to load/save map state elements like 'applications'
 */
export class MapStateProxy<S extends Sequelize.Instance<any>, T extends MapProxy<S> = MapProxy<S>>
  extends AbstractStateProxy<Immutable.Map<string, any>> implements StateProxy<Immutable.Map<string, any>> {

  protected aclass: { new(): T };
  protected instances: Immutable.Map<string, T> | null;

  constructor(aclass: { new(): T }) {
    super();
    this.aclass = aclass;
    this.instances = null;
  }

  clear() {
    this.instances = null;
  }

  async toState(): Promise<Immutable.Map<string, any>> {
    let instances: Immutable.Map<string, any> = Immutable.Map();
    if (this.instances !== null) {
      for (const [key, instance] of this.instances.entries()) {
        if (instance !== undefined) {
          instances = instances.set(key, await instance.toState());
        }
      }
    }
    return instances;
  }

  async get() {
    if (!this.instances) {
      return this.aclass.getAll().then((instances: T[]) => {
        this.instances = Immutable.Map();
        for (const instance of instances) {
          this.instances = this.instances.set(instance.getObjectKey(), instance);
        }
        return this.toState();
      });
    }
    return this.toState();
  }

  async actualSet(state: Immutable.Map<string, any>) {
    const instances = await this.get();
    const instancesKeys = Immutable.Set(instances.keys());
    const stateKeys = Immutable.Set(state.keys());
    const needUpdate = instancesKeys.intersect(stateKeys);
    const needCreation = stateKeys.subtract(instancesKeys);
    const needDeletion = instancesKeys.subtract(stateKeys);
    const errors: Error[] = [];
    let subState: Immutable.Map<string, any>;

    for (const key of needCreation) {
      subState = state.get(key);
      await
        this.aclass.findOrCreate(subState)
          .then(data => {
            this.instances = this.instances!.set(key, data);
            return this.instances;
          })
          .catch(err => { // eslint-disable-line no-loop-func
            errors.push(addErrorDetails(err, `Insert error: [${this.aclass.name}] ${subState}`));
          });
    }
    for (const key of needUpdate) {
      subState = state.get(key);
      await
        this.instances!.get(key).update(subState)
          .then(data => {
            this.instances = this.instances!.set(key, data);
            return this.instances;
          })
          .catch((err: Error) => { // eslint-disable-line no-loop-func
            errors.push(addErrorDetails(err, `Update error: [${this.aclass.name}] ${subState}`));
          });
    }
    for (const key of needDeletion) {
      await
        this.instances!.get(key).delete()
          .then(() => {
            this.instances = this.instances!.delete(key);
            return this.instances;
          })
          .catch((err: Error) => { // eslint-disable-line no-loop-func
            errors.push(addErrorDetails(err, `Delete error: [${this.aclass.name}] ${key}`));
          });
    }
    if (errors.length > 0) {
      throw new Error(errors);
    }
    return;
  }
}

/**
 * This class is a helper to load/save key/value map state elements like 'serviceData[...]'
 */
export class KeyValueStateProxy<S extends Sequelize.Instance<any>, T extends KeyValueProxy<S> = KeyValueProxy<S>>
  extends AbstractStateProxy<Immutable.Map<string, any>> implements StateProxy<Immutable.Map<string, any>> {

  protected aclass: { new(): T };
  protected instances: T[] | null;

  constructor(aclass: { new(): T }) {
    super();
    this.aclass = aclass;
    this.instances = null;
  }

  clear() {
    this.instances = null;
  }

  toState(): Promise<Immutable.Map<string, any>> {
    return this.aclass.toState(this.instances);
  }

  async get() {
    if (!this.instances) {
      return this.aclass.getAll().then((instances: T[]) => {
        this.instances = instances;
        return this.toState();
      });
    }
    return this.toState();
  }

  async actualSet(state: Immutable.Map<string, any>) {
    if (this.instances) {
      const currentList = await this.get();
      if (state.equals(currentList)) return;
      await this.aclass.truncate();
    }
    this.instances = await this.aclass.createAll(state);
    return;
  }
}
