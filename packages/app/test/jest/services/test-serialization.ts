import { ServiceBase, ServicePeer, ServicePeerHandler } from '../../../src/services/lib/class';
import { serialize, unserialize } from '../../../src/services/lib/serialization';
import { getPeerMock, setPeer, TestService, TestServiceImpl } from './mock';

describe('Serialization', () => {
  it('should return given simple values serialized', () => {
    expect(serialize([{ soupe: 'gladly' }])[0]).toEqual('{"soupe":"gladly"}');
    expect(serialize([['a', 'b', 'c']])[0]).toEqual('["a","b","c"]');
    expect(serialize([1])[0]).toEqual('1');
    expect(serialize(['a'])[0]).toEqual('"a"');
    expect(serialize([null])[0]).toEqual('null');
    const date = new Date();
    date.setUTCFullYear(2000, 0, 1);
    date.setUTCHours(0, 0, 0, 0);
    expect(serialize([date])[0])
      .toEqual('"$$date:2000-01-01T00:00:00.000Z"');
    expect(serialize()[0]).toEqual(undefined);
  });

  it('should serialize given service', () => {
    const subject = new TestService('__default__');

    expect(JSON.parse(serialize([subject])[0])).toEqual({
      $$attributes: ['getName', 'throwError', 'addObserver'],
      $$constructor: 'TestService',
      $$namespace: 'test',
      $$uuid: '__default__',
    });
  });

  it('should serialize given nested service', () => {
    const subject = new TestService('__default__');

    expect(JSON.parse(serialize([{ a: 1, service: subject }])[0]))
      .toEqual({
        a: 1,
        service: {
          $$attributes: ['getName', 'throwError', 'addObserver'],
          $$constructor: 'TestService',
          $$namespace: 'test',
          $$uuid: '__default__',
        },
      });
  });

  it('should serialize multiple values', () => {
    const subject = new TestService('__default__');
    const subjectsMetadata = {
      $$uuid: '__default__',
      $$namespace: 'test',
      $$constructor: 'TestService',
      $$attributes: ['getName', 'throwError', 'addObserver'],
    };

    expect(serialize([
      { soupe: 'gladly', service: subject },
      ['a', 'b', 'c'],
      1,
      'a',
      subject,
    ])).toEqual([
      JSON.stringify({
        soupe: 'gladly',
        service: subjectsMetadata,
      }),
      '["a","b","c"]',
      '1',
      '"a"',
      JSON.stringify(subjectsMetadata),
    ]);
  });

  it('should serialize given service implementation as its closest interface', () => {
    const subject = new TestServiceImpl('__default__');

    expect(JSON.parse(serialize([subject])[0])).toEqual({
      $$attributes: ['getName', 'throwError', 'addObserver'],
      $$constructor: 'TestService',
      $$namespace: 'test',
      $$uuid: '__default__',
    });
  });
});

describe('Deserialization', () => {
  let testHandler: ServicePeerHandler;

  beforeEach(() => {
    testHandler = {
      connect(srvc: ServiceBase) {
        setPeer(srvc, getPeerMock());
      },
    } as any;
  });

  it('should throw because result is not serialized', () => {
    expect(() => unserialize(testHandler, 'a' as any)).toThrow();
    expect(() => unserialize(testHandler, new Date() as any)).toThrow();
    expect(() => unserialize(testHandler, { a: 1 } as any)).toThrow();
    expect(() => unserialize(testHandler, ['a'])).toThrow();
    expect(() => unserialize(testHandler, [new Date()])).toThrow();
    expect(() => unserialize(testHandler, [{ a: 1 }])).toThrow();
  });

  it('should return given object as is', () => {
    expect(unserialize(testHandler, ['{"soupe":"gladly"}'])[0])
      .toEqual({
        soupe: 'gladly',
      });
    expect(unserialize(testHandler, ['["a","b","c"]'])[0]).toEqual(['a', 'b', 'c']);
    expect(unserialize(testHandler, ['1'])[0]).toEqual(1);
    expect(unserialize(testHandler, ['"a"'])[0]).toEqual('a');
    expect(unserialize(testHandler, ['null'])[0]).toEqual(null);
    const date = new Date();
    date.setUTCFullYear(2000, 0, 1);
    date.setUTCHours(0, 0, 0, 0);
    expect(unserialize(testHandler, ['"$$date:2000-01-01T00:00:00.000Z"'])[0])
      .toEqual(date);
    expect(unserialize(testHandler, ['undefined'])[0]).toEqual(undefined);
    expect(unserialize(testHandler, [undefined])[0]).toEqual(undefined);
  });

  it('should unserialize given Service', () => {
    const result = unserialize(testHandler, [JSON.stringify({
      $$attributes: ['getName'],
      $$constructor: 'TestService',
      $$namespace: 'test',
      $$uuid: '__default__',
    })]);
    expect(result[0]).toBeInstanceOf(ServicePeer);
    expect(result[0]).toHaveProperty('getName');
    expect(result[0]).toHaveProperty('uuid', '__default__');
  });

  it('should unserialize given Observer', () => {
    const result = unserialize(testHandler, [JSON.stringify({
      $$attributes: ['onTest'],
      $$constructor: 'ServiceObserver',
      $$namespace: 'bx:notifier',
      $$uuid: '__default__',
    })]);
    expect(result[0]).toBeInstanceOf(ServicePeer);
    expect(result[0]).toHaveProperty('onTest');
  });

  it('should unserialize given nested Service', () => {
    const result = unserialize(testHandler, [JSON.stringify({
      a: 1,
      service: {
        $$attributes: ['getName'],
        $$constructor: 'TestService',
        $$namespace: 'test',
        $$uuid: '__default__',
      },
    })]);
    expect(result[0]).toHaveProperty('a', 1);
    expect(result[0]).toHaveProperty('service');
    expect(result[0].service).toBeInstanceOf(ServicePeer);
    expect(result[0].service).toHaveProperty('getName');
    expect(result[0].service).toHaveProperty('uuid', '__default__');
  });

  it('should unserialize given values', () => {
    const subjectsMetadata = {
      $$uuid: '__default__',
      $$namespace: 'test',
      $$constructor: 'TestService',
      $$attributes: ['getName'],
    };

    const result = unserialize(testHandler, [
      JSON.stringify({
        soupe: 'gladly',
        service: subjectsMetadata,
      }),
      '["a","b","c"]',
      '1',
      '"a"',
      JSON.stringify(subjectsMetadata),
    ]);
    expect(result[0]).toHaveProperty('soupe', 'gladly');
    expect(result[0]).toHaveProperty('service');
    expect(result[0].service).toBeInstanceOf(ServicePeer);
    expect(result[0].service).toHaveProperty('getName');
    expect(result[0].service).toHaveProperty('uuid', '__default__');
    expect(result[1]).toEqual(['a', 'b', 'c']);
    expect(result[2]).toEqual(1);
    expect(result[3]).toEqual('a');
    expect(result[4]).toBeInstanceOf(ServicePeer);
  });

  it('should throw if $$constructor is not found', () => {
    expect(() => unserialize(testHandler, [JSON.stringify({
      $$attributes: ['getName'],
      $$constructor: 'NotATestService',
      $$namespace: 'test',
      $$uuid: '__default__',
    })])).toThrow('Unknown class');
  });

  it('should throw if $$namespace is not found', () => {
    expect(() => unserialize(testHandler, [JSON.stringify({
      $$attributes: ['getName'],
      $$constructor: 'TestService',
      $$namespace: 'test2',
      $$uuid: '__default__',
    })])).toThrow('Unknown class');
  });

  it('should throw if using a non whitelisted method on Proxy', () => {
    const subject = unserialize(testHandler, [JSON.stringify({
      $$attributes: [],
      $$constructor: 'TestService',
      $$namespace: 'test',
      $$uuid: '__default__',
    })]);

    expect(() => subject[0].getName()).toThrow('getName is not a function');
  });

  it('should throw because Service is not connected', () => {
    const subject = unserialize({ connect() { } } as any, [JSON.stringify({
      $$attributes: ['getName'],
      $$constructor: 'TestService',
      $$namespace: 'test',
      $$uuid: '__default__',
    })]);

    expect(() => subject[0].getName()).toThrow('not connected');
  });
});
