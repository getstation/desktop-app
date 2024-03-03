import { RPC } from '../../../../src/services/lib/types';
import { TestServiceProvider } from './common';

export class TestServiceProviderImpl extends TestServiceProvider implements RPC.Interface<TestServiceProvider> {

  async whoAmI() {
    return 'test';
  }
}
