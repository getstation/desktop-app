import { storage } from '@getstation/sdk';
import { StorageConsumer } from '@getstation/sdk/lib/storage/consumer';
import * as Immutable from 'immutable';
import { createStore } from 'redux';
// @ts-ignore: no declaration file
import { combineReducers } from 'redux-immutable';
import { serviceDataReducer } from '../../../app/plugins/duck';
import StorageProvider from '../../../app/sdk/storage/StorageProvider';

let data!: {
  storage: storage.StorageConsumer,
};

const initialStore = Immutable.fromJS({
  servicesData: {},
});

const reducers = combineReducers({
  servicesData: serviceDataReducer,
});

beforeAll(() => {
  const store = createStore(reducers, initialStore);
  const provider = new StorageProvider(store as any);
  const consumer = new StorageConsumer('1');
  provider.addConsumer(consumer);
  data = {
    storage: consumer,
  };
});

describe('storage', () => {

  test('getItem returns undefined if value does not exists in store', async () => {
    const value = await data.storage.getItem('testKey');
    expect(value).toBeUndefined();
  });

  test('call setItem with simple value and check updated value', async () => {
    const setItemReturn = await data.storage.setItem('testKey', 'pizza');
    expect(setItemReturn).toBeUndefined();

    const value = await data.storage.getItem('testKey');
    expect(value).toEqual('pizza');
  });

  test('call setItem with complex value and check updated value', async () => {
    const setItemReturn = await data.storage.setItem('testKey', {
      randomKey: {
        eat: 'pizza',
      },
    });
    expect(setItemReturn).toBeUndefined();

    const value = await data.storage.getItem('testKey');
    expect(value).toEqual({
      randomKey: {
        eat: 'pizza',
      },
    });
  });
});
