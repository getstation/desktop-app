import { ReactConsumer } from './react/consumer';
import { register, unregister } from './registration';
import { SearchConsumer } from './search/consumer';
import { StorageConsumer } from './storage/consumer';

export * from './common';
export * from './registration';
export * from './search';
export * from './storage';
export * from './react';

export interface SDKOptions {
  id: string,
  name: string,
}

export interface SDK {
  readonly search: SearchConsumer,
  readonly storage: StorageConsumer,
  readonly react: ReactConsumer,
  close(): void,
}

export default function sdk(options: SDKOptions): SDK {
  const search = new SearchConsumer();
  const storage = new StorageConsumer(options.id);
  const react = new ReactConsumer();
  const bxsdk = {
    search: register(search),
    storage: register(storage),
    react: register(react),
    close() {
      unregister(search);
      unregister(storage);
      unregister(react);
    }
  };
  Object.freeze(bxsdk);
  return bxsdk;
}
