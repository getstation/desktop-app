export class Consumer {
  public readonly namespace: string;
  public readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}

const defaultWeakMapValue: any = new Proxy({}, {
  get(_obj: any, prop: string | symbol) {
    console.warn(`${String(prop)} provider not implemented`);
    return defaultWeakMapValue;
  },
  apply() {
    return () => defaultWeakMapValue;
  },
});

export class DefaultWeakMap<K extends object, V> extends WeakMap<K, V> {
  get(key: K): V | undefined {
    if (super.has(key)) {
      return super.get(key);
    }
    return defaultWeakMapValue;
  }
}
