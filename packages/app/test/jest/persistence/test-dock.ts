import * as Immutable from 'immutable';
import { ListStateProxy } from '../../../src/persistence/backend';
import { DockProxy } from '../../../src/persistence/local.backend';
import umzug from '../../../src/persistence/umzug';

const dockData = Immutable.List([
  'gmail-Byg_4OpCzW',
  'gdrive-mu-B1xYEdaCMb',
  'gcalendar-mu-rkqEuaAzW',
  'station-support-Sk-5VdpCGZ'
]);

const dockData2 = Immutable.List([
  'gmail-Byg_4OpCzW',
  'gcalendar-mu-rkqEuaAzW',
  'gdrive-mu-B1xYEdaCMb',
  'station-support-Sk-5VdpCGZ'
]);

beforeAll(() => umzug.up());

const proxy = new ListStateProxy(DockProxy);

test('db has no dock', () => proxy.get()
  .then((dock: Immutable.Map<string, any>) => {
    expect(dock.size === 0).toBe(true);
  }));

test('dock with 4 applications', () => proxy.set(dockData)
  .then(() => proxy.get())
  .then((dock: Immutable.Map<string, any>) => {
    expect(dockData.toJS()).toEqual(dock.toJS());
  }));

test('change dock order', () => proxy.set(dockData2)
  .then(() => proxy.get())
  .then((dock: Immutable.Map<string, any>) => {
    expect(dockData2.toJS()).toEqual(dock.toJS());
  }));

test('empty memory cache and load from db', () => {
  proxy.clear();
  return proxy.get()
    .then((dock: Immutable.Map<string, any>) => {
      expect(dockData2.toJS()).toEqual(dock.toJS());
    });
});
