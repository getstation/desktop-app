import * as Immutable from 'immutable';
import { MapStateProxy } from '../../../app/persistence/backend';
import { ApplicationProxy } from '../../../app/persistence/local.backend';
import umzug from '../../../app/persistence/umzug';

const applicationGmail = Immutable.Map({
  'gmail-Byg_4OpCzW': Immutable.Map({
    serviceId: 'gmail',
    applicationId: 'gmail-Byg_4OpCzW',
    identityId: 'google-113495821402887020288',
    iconURL: 'http://getstation.com',
    activeTab: 'gmail-Byg_4OpCzW/S1YV_aCf-',
    notificationsEnabled: true,
    installContext: Immutable.Map({
      id: 'gmail',
      platform: 'appstore',
    }),
  }),
});

const applicationGdrive = Immutable.Map({
  'gdrive-mu-B1xYEdaCMb': Immutable.Map({
    serviceId: 'gdrive-mu',
    applicationId: 'gdrive-mu-B1xYEdaCMb',
    identityId: 'google-113495821402887020288',
    iconURL: 'http://getstation.com',
    activeTab: 'gdrive-mu-B1xYEdaCMb/BJWYEOTCG-',
    notificationsEnabled: false,
    installContext: Immutable.Map({
      id: 'gdrive-mu',
      platform: 'appstore',
    }),
  }),
});

const applicationGcal = Immutable.Map({
  'gcalendar-mu-rkqEuaAzW': Immutable.Map({
    serviceId: 'gcalendar-mu',
    applicationId: 'gcalendar-mu-rkqEuaAzW',
    subdomain: 'testdomain',
    iconURL: 'http://getstation.com',
    activeTab: 'gcalendar-mu-rkqEuaAzW/rkl94_pRz-',
    notificationsEnabled: true,
    installContext: Immutable.Map({
      id: 'gcalendar-mu',
      platform: 'appstore',
    }),
  }),
});

const applicationGcal2 = Immutable.Map({
  'gcalendar-mu-rkqEuaAzW': Immutable.Map({
    serviceId: 'gcalendar-mu',
    applicationId: 'gcalendar-mu-rkqEuaAzW',
    subdomain: 'testdomain2',
    iconURL: 'http://getstation.com',
    activeTab: 'gcalendar-mu-rkqEuaAzW/rkl94_pRz-',
    notificationsEnabled: true,
    installContext: Immutable.Map({
      id: 'gcalendar-mu',
      platform: 'appstore',
    }),
  }),
});

const applicationStation = Immutable.Map({
  'station-support-Sk-5VdpCGZ': Immutable.Map({
    serviceId: 'station-support',
    applicationId: 'station-support-Sk-5VdpCGZ',
    activeTab: 'station-support-Sk-5VdpCGZ/B1s4OaCGW',
    notificationsEnabled: false,
    installContext: Immutable.Map({
      id: 'station-support',
      platform: 'appstore',
    }),
  }),
});

const applicationStation2 = Immutable.Map({
  'station-support-Sk-5VdpCGZ': Immutable.Map({
    serviceId: 'station-support',
    applicationId: 'station-support-Sk-5VdpCGZ',
    activeTab: 'station-support-Sk-5VdpCGZ/B1s4OaCGX',
    notificationsEnabled: false,
    installContext: Immutable.Map({
      id: 'station-support',
      platform: 'appstore',
    }),
  }),
});

const applications3 = applicationGmail.merge(applicationGcal).merge(applicationStation);
const applications3Updated = applicationGmail.merge(applicationGcal2).merge(applicationStation2);

const applications4 = applications3.merge(applicationGdrive);

beforeAll(() => umzug.up());

const proxy = new MapStateProxy(ApplicationProxy);

test('db is empty', () => {
  return proxy.get()
    .then((apps: Immutable.Map<string, any>) => {
      expect(apps.size === 0).toBe(true);
    });
});

test('contains state with 3 applications', () => {
  return proxy.set(applications3)
    .then(() => proxy.get())
    .then((apps: Immutable.Map<string, any>) => {
      expect(applications3.toJS()).toEqual(apps.toJS());
    });
});

test('update with sames values', () => {
  return proxy.set(applications3)
    .then(() => proxy.get())
    .then((apps: Immutable.Map<string, any>) => {
      expect(applications3.toJS()).toEqual(apps.toJS());
    });
});

test('add one application', () => {
  return proxy.set(applications4)
    .then(() => proxy.get())
    .then((apps: Immutable.Map<string, any>) => {
      expect(applications4.toJS()).toEqual(apps.toJS());
    });
});

test('delete one application', () => {
  return proxy.set(applications3)
    .then(() => proxy.get())
    .then((apps: Immutable.Map<string, any>) => {
      expect(applications3.toJS()).toEqual(apps.toJS());
    });
});

test('update applications', () => {
  return proxy.set(applications3Updated)
    .then(() => proxy.get())
    .then((apps: Immutable.Map<string, any>) => {
      expect(applications3Updated.toJS()).toEqual(apps.toJS());
    });
});

test('empty memory cache and load from db', () => {
  proxy.clear();
  return proxy.get()
    .then((apps: Immutable.Map<string, any>) => {
      expect(applications3Updated.toJS()).toEqual(apps.toJS());
    });
});
