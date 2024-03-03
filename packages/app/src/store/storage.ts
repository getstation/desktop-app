import * as Immutable from 'immutable';
import { EventEmitter } from 'events';
import storage from '../persistence';

export default class ApiStorage extends EventEmitter {

  public api: any;

  constructor(api: any = storage) {
    super();
    this.api = api;
  }

  async getAllKeys(cb: Function) {
    const keys = Object.keys(this.api);
    if (cb) cb(null, keys);
    return keys;
  }

  async getItem(key: string, cb: Function) {
    if (key in this.api) {
      const result = await this.api[key].get();
      if (cb) cb(null, result);
      return result;
    }
    return null;
  }

  async setItem(key: string, obj: any, cb: Function) {
    if (key in this.api) {
      return this.api[key].set(obj).then(() => {
        if (cb) cb(null);
        return;
      }).catch((err: Error) => {
        this.emit('error', err, {
          custom: {
            category: 'storage',
          },
        });
      });
    }
    return;
  }

  async removeItem(key: string, cb: Function) {
    return this.setItem(key, null, cb);
  }

  getPersistConfig() {
    return {
      serialize: false,
      keyPrefix: '',
      _stateInit: Immutable.Map(),
      _stateIterator: (collection: any[], callback: Function) => {
        return collection.forEach((value, key) => callback(value, key));
      },
      _stateGetter: (state: Immutable.Map<string, any>, key: string) => state.get(key),
      _stateSetter: (state: Immutable.Map<string, any>, key: string, value: any) => state.set(key, value),
      storage: this,
    };
  }
}
