import * as Immutable from 'immutable';
import { MapStateProxy } from '../../../app/persistence/backend';
import { FavoritesSubdockOrderProxy } from '../../../app/persistence/local.backend';
import umzug from '../../../app/persistence/umzug';

const applicationGmail = Immutable.Map({
  'gmail-Byg_4OpCzW': Immutable.Map({
    applicationId: 'gmail-Byg_4OpCzW',
    order: Immutable.List(['tab1', 'tab2', 'tab3']),
  }),
});

const applicationGdrive = Immutable.Map({
  'gdrive-mu-B1xYEdaCMb': Immutable.Map({
    applicationId: 'gdrive-mu-B1xYEdaCMb',
    order: Immutable.List(['tab4', 'tab5', 'tab6']),
  }),
});

const applicationGcal = Immutable.Map({
  'gcalendar-mu-rkqEuaAzW': Immutable.Map({
    applicationId: 'gcalendar-mu-rkqEuaAzW',
    order: Immutable.List(['tab7', 'tab8', 'tab9']),
  }),
});

const applicationGcal2 = Immutable.Map({
  'gcalendar-mu-rkqEuaAzW': Immutable.Map({
    applicationId: 'gcalendar-mu-rkqEuaAzW',
    order: Immutable.List(['tab9', 'tab7', 'tab8']),
  }),
});

const applications2 = applicationGmail.merge(applicationGcal);
const applications2Updated = applicationGmail.merge(applicationGcal2);

const applications3 = applications2.merge(applicationGdrive);

beforeAll(() => umzug.up());

const proxy = new MapStateProxy(FavoritesSubdockOrderProxy);

test('db is empty', () => {
  return proxy.get()
    .then((apps: Immutable.Map<string, any>) => {
      expect(apps.size === 0).toBe(true);
    });
});

test('contains orderer tabs 1, 2, 3', () => {
  return proxy.set(applications2)
    .then(() => proxy.get())
    .then((apps: Immutable.Map<string, any>) => {
      expect(['tab1', 'tab2', 'tab3']).toEqual(apps.getIn(['gmail-Byg_4OpCzW', 'order']).toJS());
      expect(['tab7', 'tab8', 'tab9']).toEqual(apps.getIn(['gcalendar-mu-rkqEuaAzW', 'order']).toJS());
    });
});

test('update with sames values', () => {
  return proxy.set(applications2)
    .then(() => proxy.get())
    .then((apps: Immutable.Map<string, any>) => {
      expect(['tab1', 'tab2', 'tab3']).toEqual(apps.getIn(['gmail-Byg_4OpCzW', 'order']).toJS());
      expect(['tab7', 'tab8', 'tab9']).toEqual(apps.getIn(['gcalendar-mu-rkqEuaAzW', 'order']).toJS());
    });
});

test('add one application', () => {
  return proxy.set(applications3)
    .then(() => proxy.get())
    .then((apps: Immutable.Map<string, any>) => {
      expect(['tab1', 'tab2', 'tab3']).toEqual(apps.getIn(['gmail-Byg_4OpCzW', 'order']).toJS());
      expect(['tab7', 'tab8', 'tab9']).toEqual(apps.getIn(['gcalendar-mu-rkqEuaAzW', 'order']).toJS());
      expect(['tab4', 'tab5', 'tab6']).toEqual(apps.getIn(['gdrive-mu-B1xYEdaCMb', 'order']).toJS());
    });
});

test('delete one application', () => {
  return proxy.set(applications2)
    .then(() => proxy.get())
    .then((apps: Immutable.Map<string, any>) => {
      expect(['tab1', 'tab2', 'tab3']).toEqual(apps.getIn(['gmail-Byg_4OpCzW', 'order']).toJS());
      expect(['tab7', 'tab8', 'tab9']).toEqual(apps.getIn(['gcalendar-mu-rkqEuaAzW', 'order']).toJS());
    });
});

test('update applications', () => {
  return proxy.set(applications2Updated)
    .then(() => proxy.get())
    .then((apps: Immutable.Map<string, any>) => {
      expect(['tab9', 'tab7', 'tab8']).toEqual(apps.getIn(['gcalendar-mu-rkqEuaAzW', 'order']).toJS());
    });
});

test('empty memory cache and load from db', () => {
  proxy.clear();
  return proxy.get()
    .then((apps: Immutable.Map<string, any>) => {
      expect(['tab1', 'tab2', 'tab3']).toEqual(apps.getIn(['gmail-Byg_4OpCzW', 'order']).toJS());
      expect(['tab9', 'tab7', 'tab8']).toEqual(apps.getIn(['gcalendar-mu-rkqEuaAzW', 'order']).toJS());
    });
});
