// tslint:disable-next-line:no-import-side-effect
import 'reflect-metadata';
import { endpoints, namespace } from '../../../src/services/lib/const';
import { allServicesRegistry } from '../../../src/services/lib/registry';
import { TestService } from './mock';

describe('decorators', () => {
  let service: Function;
  let endpoint: Function;

  beforeAll(async () => {
    // avoid circular import conflict with fixtures
    service = (await import('../../../src/services/lib/decorator')).service;
    endpoint = (await import('../../../src/services/lib/decorator')).endpoint;
  });

  beforeEach(() => {
    allServicesRegistry.clear();
    Reflect.deleteMetadata(endpoints, TestService.prototype);
    delete TestService.prototype.constructor[namespace];
  });

  describe('service', () => {

    it('should have an empty global registry', () => {
      expect(allServicesRegistry.size).toEqual(0);
    });

    it('should register given service into global registry', () => {
      service('test')(TestService);

      expect(allServicesRegistry.size).toEqual(1);
      expect(allServicesRegistry.get('test:TestService')).toEqual(TestService);
    });

    it('should throw an error if namespace is already registered', () => {
      expect(() => service('test')(TestService)).not.toThrow();
      expect(() => service('test')(TestService)).toThrow('already registered');
    });

    it('should not add given service to global registry', () => {
      service('test', { register: false })(TestService);
      expect(allServicesRegistry.size).toEqual(0);
    });

    it('should register all function props as endpoints', () => {
      service('test')(TestService);

      const endpointsMetadata = Reflect.getMetadata(endpoints, TestService.prototype);

      expect(endpointsMetadata).toBeTruthy();
      expect(Array.from(endpointsMetadata.keys())).toEqual(['getName', 'throwError', 'addObserver']);
    });
  });

  describe('endpoint errors', () => {
    it('should throw if given class have no namespace', () => {
      expect(() => endpoint()(TestService.prototype, 'getName')).toThrow('Namespace');
    });
  });

  describe('endpoint', () => {
    beforeEach(() => {
      service('test')(TestService);
    });

    it('should register given method as a request', () => {
      endpoint()(TestService.prototype, 'getName');

      const endpointsMetadata = Reflect.getMetadata(endpoints, TestService.prototype);

      expect(endpointsMetadata.get('getName')).toHaveProperty('type', 'request');
    });

    it('should register given method as a notification', () => {
      endpoint({ type: 'notification' })(TestService.prototype, 'getName');

      const endpointsMetadata = Reflect.getMetadata(endpoints, TestService.prototype);

      expect(endpointsMetadata.get('getName')).toHaveProperty('type', 'notification');
    });
  });

});
