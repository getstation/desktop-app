import { storage } from '@getstation/sdk';
import { Store } from 'redux';
import { setServiceDataValue } from '../../plugins/duck';
import { StationState } from '../../types';
import { AbstractProvider } from '../common';

export default class StorageProvider extends AbstractProvider<storage.StorageConsumer> {

  protected store: Store<StationState>;

  constructor(store: Store<StationState>) {
    super();
    this.store = store;
  }

  addConsumer(consumer: storage.StorageConsumer) {
    super.pushConsumer(consumer);
    consumer.setProviderInterface(this.getProviderInterface());
    super.subscribeConsumer(consumer, () => {});
  }

  getProviderInterface() {
    return {
      getItem: this.getItem.bind(this),
      setItem: this.setItem.bind(this),
    };
  }

  getItem(consumerKey: string, key: string) {
    const state = this.store.getState();
    // TODO fix TS definition once servicesData is properly defined
    const item: any = state.getIn(['servicesData', consumerKey, key] as any);
    return Promise.resolve(item && item.toJS ? item.toJS() : item);
  }

  async setItem(consumerKey: string, key: string, value: any) {
    const oldValue = await this.getItem(consumerKey, key);
    this.store.dispatch(setServiceDataValue(consumerKey, key, value));
    this._consumers
      .filter(c => c.id === consumerKey)
      .forEach(c => c.onChanged.emit({
        [key]: {
          oldValue,
          newValue: value,
        },
      }));
  }

  removeItem() {
    // TODO
  }

  clear() {
    // TODO
  }
}
