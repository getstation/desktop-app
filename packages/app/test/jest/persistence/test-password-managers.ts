import * as Immutable from 'immutable';
import * as models from '../../../src/database/model';
import getPasswordManagerLinks from '../../../src/password-managers/persistence/passwordManagerLinks';
import onePasswordProxy from '../../../src/password-managers/providers/onePassword/persistence';
import umzug from '../../../src/persistence/umzug';

beforeAll(() => umzug.up());

describe('Password Manager Config', () => {
  const config1 = Immutable.Map({
    'efounders.1password.com': Immutable.Map({
      id: 'efounders.1password.com',
      domain: 'efounders.1password.com',
      email: 'hello@getstation.com',
      secretKey: 'A3-EYZGAE-RR2W8F-ZFD4X-M6DR5-6TF5A-ZZZZZ'
    })
  });

  const config2 = Immutable.Map({
    'efounders.1password.com': Immutable.Map({
      id: 'efounders.1password.com',
      domain: 'efounders.1password.com',
      email: 'hugo@getstation.com',
      secretKey: 'B4-EYZGAE-RR2W8F-ZFD4X-M6DR5-6TF5A-XXXXX'
    })
  });

  const config2Bis = Immutable.Map({
    'efounders.1password.com': Immutable.Map({
      id: 'efounders.1password.com',
      domain: 'efounders.1password.com',
      email: 'hugo@getstation.com',
      secretKey: 'B4-EYZGAE-RR2W8F-ZFD4X-M6DR5-6TF5A-XXXXX'
    })
  });

  const bothConfigs = config1.merge(config2);

  test('db is empty', () => {
    return onePasswordProxy.get().then(configs => {
      expect(configs.size === 0).toBe(true);
    });
  });

  test('contains state with 1 config', () => {
    return onePasswordProxy
      .set(config1)
      .then(() => onePasswordProxy.get())
      .then(configs => {
        expect(config1.toJS()).toEqual(configs.toJS());
      });
  });

  test('update with sames values', () => {
    return onePasswordProxy
      .set(config1)
      .then(() => onePasswordProxy.get())
      .then(configs => {
        expect(config1.toJS()).toEqual(configs.toJS());
      });
  });

  test('add one identity', () => {
    return onePasswordProxy
      .set(bothConfigs)
      .then(() => onePasswordProxy.get())
      .then(configs => {
        expect(bothConfigs.toJS()).toEqual(configs.toJS());
      });
  });

  test('delete one identity', () => {
    return onePasswordProxy
      .set(config2)
      .then(() => onePasswordProxy.get())
      .then(configs => {
        expect(config2.toJS()).toEqual(configs.toJS());
      });
  });

  test('update identity', () => {
    return onePasswordProxy
      .set(config2Bis)
      .then(() => onePasswordProxy.get())
      .then(configs => {
        expect(config2Bis.toJS()).toEqual(configs.toJS());
      });
  });

  test('empty memory cache and load from db', () => {
    onePasswordProxy.clear();
    return onePasswordProxy.get().then(configs => {
      expect(config2Bis.toJS()).toEqual(configs.toJS());
    });
  });
});

describe('Password Manager Link', () => {
  const link1 = Immutable.Map({
    'appId-1': Immutable.Map({
      applicationId: 'appId-1',
      providerId: 'onePassword',
      passwordManagerId: 'efounders.1password.com',
      passwordManagerItemId: 'JFFAA4TIKNE5DKSTRYK4QMTMZQ',
      login: 'mylogin',
      avatar: 'https://test.com/image.png'
    })
  });

  const link2 = Immutable.Map({
    'appId-2': Immutable.Map({
      applicationId: 'appId-2',
      providerId: 'onePassword',
      passwordManagerId: 'efounders.1password.com',
      passwordManagerItemId: 'AAFAA4TIKNE5DKSTRYK4BBBBBB',
      login: 'mylogin2Bis',
      avatar: 'https://test.com/image2Bis.png'
    })
  });

  const link2Bis = Immutable.Map({
    'appId-2': Immutable.Map({
      applicationId: 'appId-2',
      providerId: 'onePassword',
      passwordManagerId: 'efounders.1password.com',
      passwordManagerItemId: 'AAFAA4TIKNE5DKSTRYK4BBBBBB',
      login: 'mylogin2Bis',
      avatar: 'https://test.com/image2Bis.png'
    })
  });

  const bothLinks = link1.merge(link2);

  const proxyLinks = getPasswordManagerLinks(models);

  test('db is empty', () => {
    return proxyLinks.get().then(links => {
      expect(links.size === 0).toBe(true);
    });
  });

  test('contains state with 1 config', () => {
    return proxyLinks
      .set(link1)
      .then(() => proxyLinks.get())
      .then(links => {
        expect(link1.toJS()).toEqual(links.toJS());
      });
  });

  test('update with sames values', () => {
    return proxyLinks
      .set(link1)
      .then(() => proxyLinks.get())
      .then(links => {
        expect(link1.toJS()).toEqual(links.toJS());
      });
  });

  test('add one identity', () => {
    return proxyLinks
      .set(bothLinks)
      .then(() => proxyLinks.get())
      .then(links => {
        expect(bothLinks.toJS()).toEqual(links.toJS());
      });
  });

  test('delete one identity', () => {
    return proxyLinks
      .set(link2)
      .then(() => proxyLinks.get())
      .then(links => {
        expect(link2.toJS()).toEqual(links.toJS());
      });
  });

  test('update identity', () => {
    return proxyLinks
      .set(link2Bis)
      .then(() => proxyLinks.get())
      .then(links => {
        expect(link2Bis.toJS()).toEqual(links.toJS());
      });
  });

  test('empty memory cache and load from db', () => {
    proxyLinks.clear();
    return proxyLinks.get().then(links => {
      expect(link2Bis.toJS()).toEqual(links.toJS());
    });
  });
});
