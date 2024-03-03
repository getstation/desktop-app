import * as Immutable from 'immutable';
import { ListStateProxy } from '../../../src/persistence/backend';
import { DockProxy } from '../../../src/persistence/local.backend';
import umzug from '../../../src/persistence/umzug';

const ms = require('ms');

const dockData = Immutable.List([
  'gmail-Byg_4OpCzW',
  'gdrive-mu-B1xYEdaCMb',
  'gcalendar-mu-rkqEuaAzW',
  'station-support-Sk-5VdpCGZ',
]);

beforeAll(() => umzug.up());

const proxy = new ListStateProxy(DockProxy);

describe('persistence locking', () => {
  // This test is only here to easily reproduce the `Too much pending tasks` error
  // that we are no longer unexpectedly triggering
  test.skip('persistence throws too much pending tasks error', async () => {
    const actualSetIterator = function* () {
      for (let i = 0; i < 2000; i += 1) {
        yield proxy.actualSet(dockData);
      }
    };

    jest.setTimeout(ms('2min'));

    expect.assertions(1);
    await expect(Promise.all(actualSetIterator())).rejects.toMatchObject(new Error('Too much pending tasks'));
  });

  test('persistence do not throws too much pending tasks error', async () => {

    const setIterator = function* () {
      for (let i = 0; i < 2000; i += 1) {
        yield proxy.set(dockData, 1000);
      }
    };

    jest.setTimeout(ms('1min'));

    expect.assertions(1);
    await expect(Promise.all(setIterator())).resolves.not.toThrow();
  });
});
