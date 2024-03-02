import * as Immutable from 'immutable';
import { SingletonStateProxy } from '../../../app/persistence/backend';
import { UserProxy } from '../../../app/persistence/local.backend';
import umzug from '../../../app/persistence/umzug';

const userData = Immutable.Map({
  id: 'user-Bku4OT0zZ',
  email: 'joel@getstation.com',
  name: 'user'
});

const userData2 = Immutable.Map({
  id: 'user-Bku4OT0zZ',
  email: 'joel@getstation.com',
  name: null
});

const userData3 = Immutable.Map({
  id: 'user-Bku4OT1zZ',
  email: 'hello@getstation.com',
  lastName: 'hello',
  firstName: 'station'
});

const userData2Expected = {
  id: 'user-Bku4OT0zZ',
  email: 'joel@getstation.com'
};

beforeAll(() => umzug.up());

const proxy = new SingletonStateProxy(UserProxy);

test('db has no user', () => proxy.get()
  .then(user => {
    expect(user.size === 0).toBe(true);
  }));

test('user with 4 data fields', () => proxy.set(userData)
  .then(() => proxy.get())
  .then(user => {
    expect(userData.toJS()).toEqual(user.toJS());
  }));

test('user without name', () => proxy.set(userData2)
  .then(() => proxy.get())
  .then(user => {
    expect(userData2Expected).toEqual(user.toJS());
  }));

test('user without name', () => proxy.set(userData2)
  .then(() => proxy.get())
  .then(user => {
    expect(userData2Expected).toEqual(user.toJS());
  }));

test('empty memory cache and load from db', () => {
  proxy.clear();
  return proxy.get()
    .then(user => {
      expect(userData2Expected).toEqual(user.toJS());
    });
});

test('set user with first and last name', () => proxy.set(userData3)
  .then(() => proxy.get())
  .then(user => {
    expect(userData3.toJS()).toEqual(user.toJS());
  }));
