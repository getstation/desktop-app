import { ServiceBase } from './class';
import { namespace } from './const';

export class ServicesRegistry {
  registry: Map<string, new (...args: any[]) => ServiceBase>;

  constructor() {
    this.registry = new Map();
  }

  add(klass: new (...args: any[]) => ServiceBase, n?: string) {
    const nmsp: string = n || (klass as any)[namespace];
    if (this.registry.has(nmsp)) {
      throw new Error(`A Service is already registered for ${nmsp}`);
    }
    this.registry.set(nmsp, klass);
  }

  get(key: string) {
    return this.registry.get(key);
  }

  has(key: string) {
    return this.registry.has(key);
  }

  clear() {
    this.registry.clear();
  }

  get size() {
    return this.registry.size;
  }
}

// TODO find a better way
export const allServicesRegistry = new ServicesRegistry();
