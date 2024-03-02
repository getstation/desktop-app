import * as Immutable from 'immutable';
import umzug from '../../../app/persistence/umzug';
import * as models from '../../../app/database/model';
import getUIProxy from '../../../app/ui/persistence/proxy';

const uiData = Immutable.Map();

const uiData2 = Immutable.Map({
  notSaved: true,
});

const uiData2Expected = {
};

beforeAll(() => umzug.up());

const proxy = getUIProxy(models);

test('db has no ui data', () => proxy.get()
  .then(ui => {
    expect(ui.size === 0).toBe(true);
  }));

test('ui state 1', () => proxy.set(uiData)
  .then(() => proxy.get())
  .then(ui => {
    expect(ui.size === 0).toBe(true);
  }));

test('ui state 2', () => proxy.set(uiData2)
  .then(() => proxy.get())
  .then(ui => {
    expect(ui.toJS()).toEqual(uiData2Expected);
  }));

test('empty memory cache and load from db', () => {
  proxy.clear();
  return proxy.get()
    .then(ui => {
      expect(ui.toJS()).toEqual(uiData2Expected);
    });
});
