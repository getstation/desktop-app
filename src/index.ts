import { register, unregister } from './registration';
import { SearchConsumer } from './search/consumer';
import { StorageConsumer } from './storage/consumer';

export * from './common';
export * from './registration';
export * from './search';
export * from './storage';

export interface SDKOptions {
  id: string,
  name: string,
}

export interface SDK {
  readonly search: SearchConsumer,
  readonly storage: StorageConsumer,
  close(): void,
}

export default function sdk(options: SDKOptions): SDK {
  const search = new SearchConsumer(options.name);
  const storage = new StorageConsumer(options.id);
  const bxsdk = {
    search: register(search),
    storage: register(storage),
    close() {
      unregister(search);
      unregister(storage);
    }
  };
  Object.freeze(bxsdk);
  return bxsdk;
}
