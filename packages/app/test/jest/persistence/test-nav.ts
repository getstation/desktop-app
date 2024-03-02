import * as Immutable from 'immutable';
import { SingletonStateProxy } from '../../../src/persistence/backend';
import { NavProxy } from '../../../src/persistence/local.backend';
import umzug from '../../../src/persistence/umzug';

const navData = Immutable.Map({
  tabApplicationId: 'gmail-Byg_4OpCzW',
  previousTabApplicationId: 'station-support-Sk-5VdpCGZ'
});

const navData2 = Immutable.Map({
  tabApplicationId: 'station-support-Sk-5VdpCGZ',
  previousTabApplicationId: 'gmail-Byg_4OpCzW'
});

beforeAll(() => umzug.up());

const proxy = new SingletonStateProxy(NavProxy);

test('db has no nav', () => proxy.get()
  .then(nav => {
    expect(nav.size === 0).toBe(true);
  }));

test('nav state 1', () => proxy.set(navData)
  .then(() => proxy.get())
  .then(nav => {
    expect(navData.toJS()).toEqual(nav.toJS());
  }));

test('nav state 2', () => proxy.set(navData2)
  .then(() => proxy.get())
  .then(nav => {
    expect(navData2.toJS()).toEqual(nav.toJS());
  }));

test('empty memory cache and load from db', () => {
  proxy.clear();
  return proxy.get()
    .then(nav => {
      expect(navData2.toJS()).toEqual(nav.toJS());
    });
});
