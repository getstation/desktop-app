import * as Immutable from 'immutable';
import { MapStateProxy } from '../../../app/persistence/backend';
import { TabProxy } from '../../../app/persistence/local.backend';
import umzug from '../../../app/persistence/umzug';

const tabGcal = Immutable.Map({
  'gcalendar-mu-rkqEuaAzW/tabGcal1': Immutable.Map({
    isApplicationHome: true,
    applicationId: 'gcalendar-mu-rkqEuaAzW',
    url: 'https://calendar.google.com/calendar/render?pli=1#main_7',
    tabId: 'gcalendar-mu-rkqEuaAzW/tabGcal1',
    title: 'Station - Calendar - Week of Jun 18, 2017',
    favicons: Immutable.List(['https://calendar.google.com/googlecalendar/images/favicon_v2014_19.ico']),
    lastActivityAt: 1527777677797,
  }),
});

const tabGcal2 = Immutable.Map({
  'gcalendar-mu-rkqEuaAzW/tabGcal2': Immutable.Map({
    isApplicationHome: true,
    applicationId: 'gcalendar-mu-rkqEuaAzW',
    url: 'https://calendar.google.com/calendar/render?pli=1#main_7',
    tabId: 'gcalendar-mu-rkqEuaAzW/tabGcal2',
    title: 'Station - Calendar - Week of Jun 18, 2017',
    favicons: Immutable.List(['https://calendar.google.com/googlecalendar/images/favicon_v2014_19.ico']),
    lastActivityAt: 1527777677797,
  }),
});

const tabGcalBis = Immutable.Map({
  'gcalendar-mu-rkqEuaAzW/tabGcal1': Immutable.Map({
    isApplicationHome: true,
    applicationId: 'gcalendar-mu-rkqEuaAzW',
    url: 'https://calendar.google.com/calendar/render?pli=1#main_7',
    tabId: 'gcalendar-mu-rkqEuaAzW/tabGcal1',
    title: 'Station - Calendar - Week of Jun 18, 2018',
    lastActivityAt: 1527777677797,
  }),
});

const invalidTab = Immutable.Map({
  null: Immutable.Map({
    title: 'invalid'
  }),
});

const tabsGcal = tabGcal.merge(tabGcal2);
const tabsGcalAndInvalid = tabGcal.merge(invalidTab);

beforeAll(() => umzug.up());

const proxy = new MapStateProxy(TabProxy);

test('db has no tabs', () => proxy.get()
    .then(tabs => {
      expect(tabs.size === 0).toBe(true);
    }));

test('contains state with 1 tab', () => proxy.set(tabGcal)
    .then(() => proxy.get())
    .then(tabs => {
      expect(tabGcal.toJS()).toEqual(tabs.toJS());
    }));

test('update with sames values', () => proxy.set(tabGcal)
    .then(() => proxy.get())
    .then(tabs => {
      expect(tabGcal.toJS()).toEqual(tabs.toJS());
    }));

test('add one tab', () => proxy.set(tabsGcal)
    .then(() => proxy.get())
    .then(tabs => {
      expect(tabsGcal.toJS()).toEqual(tabs.toJS());
    }));

test('delete one tab', () => proxy.set(tabGcal)
    .then(() => proxy.get())
    .then(tabs => {
      expect(tabGcal.toJS()).toEqual(tabs.toJS());
    }));

test(
  'invalid tab throws but other tab is updated',
  () => expect(proxy.set(tabsGcalAndInvalid)).rejects.toBeDefined()
    .then(() => proxy.get())
    .then(tabs => {
      expect(tabGcal.toJS()).toEqual(tabs.toJS());
    })
);

test('update one tab', () => proxy.set(tabGcalBis)
    .then(() => proxy.get())
    .then(tabs => {
      expect(tabGcalBis.toJS()).toEqual(tabs.toJS());
    }));

test('empty memory cache and load from db', () => {
  proxy.clear();
  return proxy.get()
    .then(tabs => {
      expect(tabGcalBis.toJS()).toEqual(tabs.toJS());
    });
});
