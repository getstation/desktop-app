import { BxAppManifest } from '../../../applications/manifest-provider/bxAppManifest';
import { ServiceBase } from '../../lib/class';
import { service, timeout } from '../../lib/decorator';
import { RPC } from '../../lib/types';

@service('manifest')
export class ManifestService extends ServiceBase implements RPC.Interface<ManifestService> {
  @timeout(30000)
  // @ts-ignore
  getManifest(manifestURL: string): Promise<BxAppManifest> {}
}
