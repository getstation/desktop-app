import * as Immutable from 'immutable';
import { KeyValueStateProxy } from '../../../app/persistence/backend';
import umzug from '../../../app/persistence/umzug';
import { ServicesDataProxyMixin } from '../../../app/plugins/persistence';

const immutableState1 = Immutable.Map({
  manifestURL1: Immutable.Map({
    poisson: 'truite',
    soupe: 4000,
    compote: Immutable.Map({
      pomme: 'verte',
    }),
  }),
  manifestURL2: Immutable.Map({
    poisson: 'saumon',
  }),
});

const objState1 = {
  manifestURL1: { compote: { pomme: 'verte' }, poisson: 'truite', soupe: 4000 },
  manifestURL2: { poisson: 'saumon' },
};

const immutableState2 = Immutable.Map({
  manifestURL1: Immutable.Map({
    poisson: 'truite',
    soupe: 4000,
    compote: Immutable.Map({
      pomme: true,
    }),
  }),
  manifestURL2: Immutable.Map({
    poisson: 'saumon',
  }),
});

const objState2 = {
  manifestURL1: { compote: { pomme: true }, poisson: 'truite', soupe: 4000 },
  manifestURL2: { poisson: 'saumon' },
};

const immutableState3 = Immutable.Map({
  manifestURL1: Immutable.Map({
    poisson: 'truite',
    compote: Immutable.Map({
      pomme: true,
    }),
  }),
});

const objState3 = { manifestURL1: { compote: { pomme: true }, poisson: 'truite' } };

beforeAll(() => umzug.up());

const proxy = new KeyValueStateProxy(ServicesDataProxyMixin);

test('db has no services data', async () => {
  const p = await proxy;
  const data = await p.get();
  expect(data.size === 0).toBe(true);
});

test('contains state with slack data', async () => {
  const p = await proxy;
  await p.set(immutableState1);
  const data = await p.get();
  expect(data.toJS()).toEqual(objState1);
});

test('update with sames values', async () => {
  const p = await proxy;
  await p.set(immutableState1);
  const data = await p.get();
  expect(data.toJS()).toEqual(objState1);
});

test('update sub key', async () => {
  const p = await proxy;
  await p.set(immutableState2);
  const data = await p.get();
  expect(data.toJS()).toEqual(objState2);
});

test('delete one key', async () => {
  const p = await proxy;
  await p.set(immutableState3);
  const data = await p.get();
  expect(data.toJS()).toEqual(objState3);
});

test('empty memory cache and load from db', async () => {
  const p = await proxy;
  await p.clear();
  const data = await p.get();
  expect(data.toJS()).toEqual(objState3);
});
