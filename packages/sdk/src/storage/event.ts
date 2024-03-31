export class StorageEvent {

  protected listeners: Function[];

  constructor() {
    this.listeners = [];
  }

  addListener(callback: (changes: StorageChanges) => void) {
    this.listeners.push(callback);
  }

  hasListener(callback: Function) {
    return this.listeners.indexOf(callback) !== -1;
  }

  removeListener(callback: Function) {
    const index = this.listeners.indexOf(callback);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  emit(...args: any[]) {
    for (const listener of this.listeners) {
      listener(...args);
    }
  }
}

export interface StorageChange<T = any> {
  oldValue: T | undefined,
  newValue: T | undefined,
}

export interface StorageChanges {
  [key: string]: StorageChange<any>
}
