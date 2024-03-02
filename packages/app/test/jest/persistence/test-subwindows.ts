import * as Immutable from 'immutable';
import { ListStateProxy } from '../../../app/persistence/backend';
import { SubwindowProxy } from '../../../app/persistence/local.backend';
import umzug from '../../../app/persistence/umzug';

const subData = Immutable.Set([
  'gmail-Byg_4OpCzW',
  'gdrive-mu-B1xYEdaCMb',
  'gcalendar-mu-rkqEuaAzW',
  'station-support-Sk-5VdpCGZ'
]);

const subData2 = Immutable.Set([
  'gmail-Byg_4OpCzW',
  'gcalendar-mu-rkqEuaAzW'
]);

beforeAll(() => umzug.up());

const proxy = new ListStateProxy(SubwindowProxy);

test('db has no subwindow', () => proxy.get()
  .then(subwindows => {
    expect(subwindows.size === 0).toBe(true);
  }));

test('4 subwindows', () => proxy.set(subData)
  .then(() => proxy.get())
  .then(subwindows => {
    expect(subData.toJS()).toEqual(subwindows.toJS());
  }));

test('2 subwindows', () => proxy.set(subData2)
  .then(() => proxy.get())
  .then(subwindows => {
    expect(subData2.toJS()).toEqual(subwindows.toJS());
  }));

test('empty memory cache and load from db', () => {
  proxy.clear();
  return proxy.get()
    .then(subwindows => {
      expect(subData2.toJS()).toEqual(subwindows.toJS());
    });
});
