import * as Immutable from 'immutable';
import { MapStateProxy } from '../../../app/persistence/backend';
import { ApplicationSettingsProxy } from '../../../app/persistence/local.backend';
import umzug from '../../../app/persistence/umzug';

const serviceGDrive = Immutable.Map({
  'gdrive-mu': Immutable.Map({
    manifestURL: 'https://asdasd',
    alwaysLoaded: false,
    doNotInstall: false,
    instanceLogoInDock: false,
  }),
});

const serviceGDriveUpdated = Immutable.Map({
  'gdrive-mu': Immutable.Map({
    manifestURL: 'https://asdasd',
    alwaysLoaded: true,
    doNotInstall: false,
    instanceLogoInDock: false,
  }),
});

describe('persistence:test-services', () => {
  const proxy = new MapStateProxy(ApplicationSettingsProxy);

  beforeAll(() => umzug.up());

  test('db is empty', () => {
    return proxy.get()
      .then((services: Immutable.Map<string, any>) => {
        expect(services.size === 0).toBe(true);
      });
  });

  test('contains state with 1 service', () => {
    return proxy.set(serviceGDrive)
      .then(() => proxy.get())
      .then((services: Immutable.Map<string, any>) => {
        expect(serviceGDrive.toJS()).toEqual(services.toJS());
      });
  });

  test('update with sames values', () => {
    return proxy.set(serviceGDrive)
      .then(() => proxy.get())
      .then((services: Immutable.Map<string, any>) => {
        expect(serviceGDrive.toJS()).toEqual(services.toJS());
      });
  });

  test('update 1 service', () => {
    return proxy.set(serviceGDriveUpdated)
      .then(() => proxy.get())
      .then((services: Immutable.Map<string, any>) => {
        expect(services.getIn(['gdrive-mu', 'alwaysLoaded'])).toEqual(true);
      });
  });
});
