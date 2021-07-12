import * as AsyncLock from 'async-lock';
import * as Immutable from 'immutable';
import * as Sequelize from 'sequelize';

// In order to have better TS support in IDE
// replace Classes that have a lot of static with dedicated classes or functions

const lock = new AsyncLock();

const filterMap = (x: any) => {
  if (x === null) return false;
  return x !== undefined;
};

export type MapObjectToState<T> = (obj: any) => Promise<T>;
export type MapStateToObject<T> = (obj: Immutable.Collection<any, any>) => Promise<T>;

function createInstanceFromClass<T>(cl: new(...args: any[]) => T, ...args: any[]): T {
  return new cl(...args);
}

export class SingletonProxy<T extends Sequelize.Instance<any>> {

  public modelInstance: T;

  constructor(model: T) {
    this.modelInstance = model;
  }

  static async mapStateToObject(_state: Immutable.Map<string, any>): Promise<any> {
    throw new Error('Unimplement method');
  }

  static mapObjectToState(_obj: any): Promise<Immutable.Map<string, any>> {
    throw new Error('Unimplement method');
  }

  static async create(_state: Immutable.Map<string, any>): Promise<any> {
    throw new Error('Unimplement method');
  }

  static async getOne(): Promise<any> {
    throw new Error('Unimplement method');
  }

  static async truncate() {
    throw new Error('Unimplement method');
  }

  get() {
    return this.modelInstance;
  }

  async update(state: Immutable.Map<string, any>) {
    const [obj] = await this.constructor.mapStateToObject(state);

    this.modelInstance = await lock.acquire('db', () => this.modelInstance.update(obj));
    return this;
  }

  toJSON() {
    return this.modelInstance.toJSON();
  }

  isEmpty() {
    return !this.modelInstance;
  }

  async toState() {
    if (!this.modelInstance) return null;
    return this.constructor.mapObjectToState(this.modelInstance);
  }
}

export class MapProxy<T extends Sequelize.Instance<any>> extends SingletonProxy<T> {

  static async mapObjectToStateOrNull(dbObj: any) {
    if (!dbObj) return null;
    return this.mapObjectToState(dbObj);
  }

  static async getAll(): Promise<any[]> {
    throw new Error('Unimplement method');
  }

  async delete() {
    return this.modelInstance.destroy();
  }

  getObjectKey(): string {
    throw new Error('Unimplement method');
  }
}

export class ListProxy<T extends Sequelize.Instance<any>> extends SingletonProxy<T> {
  static async getAll(): Promise<any[]> {
    throw new Error('Unimplement method');
  }

  static async mapArrayToState(_obj: any[]) {
    throw new Error('Unimplement method');
  }

  static async toState(instances: ListProxy<any>[]) {
    return this.mapArrayToState(instances.map(elt => elt.modelInstance));
  }
}

export class KeyValueProxy<T extends Sequelize.Instance<any>> extends SingletonProxy<T> {
  static async getAll(): Promise<any> {
    throw new Error('Unimplement method');
  }

  static async mapObjectToState(_obj: any): Promise<Immutable.Map<string, any>> {
    throw new Error('Unimplement method');
  }

  static async toState(instances: KeyValueProxy<any>[]) {
    if (!instances) return null;
    return this.mapObjectToState(instances.map(elt => elt.modelInstance));
  }
}

export type SingletonProxyMixinParams = {
  model: Sequelize.Model<any, any>
  mapStateToObject: MapStateToObject<any>
  mapObjectToState: MapObjectToState<Immutable.Map<string, any>>,
};

export const SingletonProxyMixin = <T extends Sequelize.Instance<any>>({
  model,
  mapStateToObject,
  mapObjectToState,
}: SingletonProxyMixinParams) => class extends SingletonProxy<T> {
  static async mapStateToObject(state: Immutable.Map<string, any>) {
    const ret = await mapStateToObject(state);
    if (Array.isArray(ret)) return ret;
    return [ret];
  }

  static async mapObjectToState(obj: any) {
    return mapObjectToState(obj).then(x => x.filter(filterMap));
  }

  static async create(state: Immutable.Map<string, any>) {
    const m = await this.mapStateToObject(state);
    const x = await lock.acquire('db', () => model.create(...m));
    return createInstanceFromClass(this, x);
  }

  static async truncate() {
    return model.truncate();
  }

  static async getOne(...args: any[]) {
    const result = await model.findOne(...args);
    return new this(result);
  }
};

export type MapProxyMixinParams = {
  model: Sequelize.Model<any, any>
  key: string
  mapStateToObject: MapStateToObject<any>
  mapObjectToState: MapObjectToState<Immutable.Collection<any, any>>,
};

export const MapProxyMixin = <T extends Sequelize.Instance<any>>({
  model,
  key,
  mapStateToObject,
  mapObjectToState,
}: MapProxyMixinParams) => class extends MapProxy<T> {
  static async mapStateToObject(state: Immutable.Map<string, any>) {
    const ret = await mapStateToObject(state);
    if (Array.isArray(ret)) return ret;
    return [ret];
  }

  static async mapObjectToState(obj: any) {
    return mapObjectToState(obj).then(x => x.filter(filterMap));
  }

  static* mapAll(results: any[]) {
    for (const result of results) {
      yield createInstanceFromClass(this, result);
    }
  }

  static async create(state: Immutable.Map<string, any>) {
    const m = await this.mapStateToObject(state);
    const x = await lock.acquire('db', () => model.create(...m));
    return createInstanceFromClass(this, x);
  }

  static async findOrCreate(state: Immutable.Map<string, any>) {
    const [data] = await this.mapStateToObject(state);
    const options = {
      where: { [key]: data[key] },
      defaults: data,
    };
    const [x] = await lock.acquire('db', () => model.findOrCreate(options));
    return createInstanceFromClass(this, x);
  }

  static async getAll(...args: any[]) {
    return model.findAll(...args).then(this.mapAll.bind(this));
  }

  getObjectKey() {
    return this.modelInstance.get(key);
  }
};

export type ListProxyMixinParams = {
  model: Sequelize.Model<any, any>
  mapStateToArray: MapStateToObject<any[]>
  mapArrayToState: MapObjectToState<Immutable.List<any>>,
  orderBy?: string,
};

export const ListProxyMixin = <T extends Sequelize.Instance<any>>({
  model,
  mapStateToArray,
  mapArrayToState,
  orderBy,
}: ListProxyMixinParams) => class extends ListProxy<T> {
  static async mapStateToArray(state: Immutable.Map<string, any>) {
    return mapStateToArray(state);
  }

  static async mapArrayToState(obj: any[]) {
    return mapArrayToState(obj);
  }

  static mapAll(results: any[]) {
    let i = 0;
    const l = [];
    for (const result of results) {
      l.push(createInstanceFromClass(this, result, i));
      i += 1;
    }
    return l;
  }

  static async createAll(state: Immutable.Map<string, any>) {
    const m = await this.mapStateToArray(state);
    await lock.acquire('db', () => model.bulkCreate(m));
    return await this.getAll();
  }

  static async truncate() {
    return model.truncate();
  }

  static async getAll(...args: any[]) {
    const opts = orderBy ? { order: [orderBy] } : undefined;
    return model.findAll(...args, opts).then(this.mapAll.bind(this));
  }
};

export type KeyValueProxyMixinParams = {
  model: Sequelize.Model<any, any>
  key: string,
  mapStateToObject: MapStateToObject<any>
  mapObjectToState: MapObjectToState<Immutable.Map<string, any>>,
};
export type KeyValueProxyMixinLine = {
  key: string,
  value: string,
  [x: string]: string,
};

export const KeyValueProxyMixin = <T extends Sequelize.Instance<any>>({
  model,
  key,
  mapStateToObject,
  mapObjectToState,
}: KeyValueProxyMixinParams) => class extends KeyValueProxy<T> {

  static async mapStateToObject(state: Immutable.Map<string, any>): Promise<Record<string, Record<string, string>>> {
    return await mapStateToObject(state);
  }

  /**
   * The object to feed to sequelize
   */
  static getObjectToInsert(groupBy: string, k: string, v: string): KeyValueProxyMixinLine {
    return { [key]: groupBy, key: k, value: v };
  }

  static async mapObjectToState(obj: KeyValueProxyMixinLine[]) {
    return await mapObjectToState(obj);
  }

  static async createAll(state: Immutable.Map<string, any>) {
    const m = await this.mapStateToObject(state);
    const keyValues = Object.entries(m).reduce(
      (previous, [k, v]) => {
        return [...previous, ...Object.entries(v).map(([k2, v2]) =>
          this.getObjectToInsert(k, k2, v2)
        )];
      }, []
    );
    await lock.acquire('db', () => model.bulkCreate(keyValues));
    return await this.getAll();
  }

  static truncate() {
    return model.truncate();
  }

  static mapAll(results: any[]) {
    return results.map(x => createInstanceFromClass(this, x));
  }

  static async getAll(options: Sequelize.FindOptions<any> = {}) {
    return model
      .findAll(options)
      .then(this.mapAll.bind(this));
  }
};
