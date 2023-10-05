import * as Immutable from 'immutable';
import { SingletonStateProxy } from '../../../app/persistence/backend';
import { AppProxy } from '../../../app/persistence/local.backend';
import umzug from '../../../app/persistence/umzug';

const appData = Immutable.Map({
  version: 1,
  autoLaunchEnabled: true,
  hideMainMenu: true,
  downloadFolder: '/any/path',
  promptDownload: false
});

const appData2 = Immutable.Map({
  version: 2,
  autoLaunchEnabled: true,
  hideMainMenu: true,
  downloadFolder: '/any/path',
  promptDownload: true
});

const wrongData = Immutable.Map({
  version: 1,
  unaivalableProp: true,
  autoLaunchEnabled: true,
  hideMainMenu: true,
  downloadFolder: '/any/path',
  promptDownload: false
});

const emptyData = Immutable.Map({
  version: 1
});

const correctedData = {
  version: 1,
  autoLaunchEnabled: true,
  hideMainMenu: true,
  downloadFolder: '/any/path',
  promptDownload: false
};

beforeAll(() => umzug.up());

const proxy = new SingletonStateProxy(AppProxy);

test('db has no app', () =>
  proxy.get().then((app: Immutable.Map<string, any>) => {
    expect(app.size === 0).toBe(true);
  }));

test('Should return filtered element if bad data sent', () =>
  proxy
    .set(wrongData)
    .then(() => proxy.get())
    .then((app: Immutable.Map<string, any>) => {
      expect(app.toJS()).toEqual(correctedData);
    }));

test('Should return correct data if empty data', () =>
  proxy
    .set(emptyData)
    .then(() => proxy.get())
    .then((app: Immutable.Map<string, any>) => {
      expect(app.toJS()).toEqual(correctedData);
    }));

test('contains app version 1', () =>
  proxy
    .set(appData)
    .then(() => proxy.get())
    .then((app: Immutable.Map<string, any>) => {
      expect(appData.toJS()).toEqual(app.toJS());
    }));

test('update app to version 2', () =>
  proxy
    .set(appData2)
    .then(() => proxy.get())
    .then((app: Immutable.Map<string, any>) => {
      expect(appData2.toJS()).toEqual(app.toJS());
    }));

test('empty memory cache and load from db', () => {
  proxy.clear();
  return proxy.get().then((app: Immutable.Map<string, any>) => {
    expect(appData2.toJS()).toEqual(app.toJS());
  });
});
