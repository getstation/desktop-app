import * as Immutable from 'immutable';
import { MapStateProxy } from '../../../app/persistence/backend';
import { IdentityProxy } from '../../../app/persistence/local.backend';
import umzug from '../../../app/persistence/umzug';

const identity1 = Immutable.Map({
  'google-113495821402887020288': Immutable.Map({
    accessToken: 'aToken',
    identityId: 'google-113495821402887020288',
    profileData: Immutable.Map({
      displayName: 'Station dev',
      email: 'hello@getstation.com',
      imageURL: 'http://getstation.com'
    }),
    provider: 'google',
    refreshToken: 'aToken',
    userId: '113495821402887020288'
  })
});

const identity2 = Immutable.Map({
  'google-113495821402887020289': Immutable.Map({
    accessToken: 'aToken',
    identityId: 'google-113495821402887020289',
    profileData: Immutable.Map({
      displayName: 'Station dev',
      email: 'hello@getstation.com',
      imageURL: 'http://getstation.com'
    }),
    provider: 'google',
    refreshToken: 'aToken',
    userId: '113495821402887020289'
  })
});

const identity2Bis = Immutable.Map({
  'google-113495821402887020289': Immutable.Map({
    accessToken: 'aTokenBis',
    identityId: 'google-113495821402887020289',
    profileData: Immutable.Map({
      displayName: 'Station dev',
      email: 'hello@getstation.com',
      imageURL: 'http://getstation.com'
    }),
    provider: 'google',
    refreshToken: 'aToken',
    userId: '113495821402887020289'
  })
});


const bothIdentities = identity1.merge(identity2);

beforeAll(() => umzug.up());

const proxy = new MapStateProxy(IdentityProxy);

test('db is empty', () => {
  return proxy.get()
    .then(identities => {
      expect(identities.size === 0).toBe(true);
    });
});

test('contains state with 1 identity', () => {
  return proxy.set(identity1)
    .then(() => proxy.get())
    .then(identities => {
      expect(identity1.toJS()).toEqual(identities.toJS());
    });
});

test('update with sames values', () => {
  return proxy.set(identity1)
    .then(() => proxy.get())
    .then(identities => {
      expect(identity1.toJS()).toEqual(identities.toJS());
    });
});

test('add one identity', () => {
  return proxy.set(bothIdentities)
    .then(() => proxy.get())
    .then(identities => {
      expect(bothIdentities.toJS()).toEqual(identities.toJS());
    });
});

test('delete one identity', () => {
  return proxy.set(identity2)
    .then(() => proxy.get())
    .then(identities => {
      expect(identity2.toJS()).toEqual(identities.toJS());
    });
});

test('update identity', () => {
  return proxy.set(identity2Bis)
    .then(() => proxy.get())
    .then(identities => {
      expect(identity2Bis.toJS()).toEqual(identities.toJS());
    });
});

test('empty memory cache and load from db', () => {
  proxy.clear();
  return proxy.get()
    .then(identities => {
      expect(identity2Bis.toJS()).toEqual(identities.toJS());
    });
});
