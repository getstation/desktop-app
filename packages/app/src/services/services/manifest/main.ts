import { take } from 'rxjs/operators';
import ManifestProvider from '../../../applications/manifest-provider/manifest-provider';
import { RPC } from '../../lib/types';
import { ManifestService } from './interface';

export class ManifestServiceImpl extends ManifestService implements RPC.Interface<ManifestService> {
  protected manifestProvider: ManifestProvider;

  async getManifest(manifestURL: string) {
    const bxApp = await this.manifestProvider.get(manifestURL).pipe(take(1)).toPromise();
    return bxApp.manifest;
  }

  init(manifestProvider: ManifestProvider) {
    this.manifestProvider = manifestProvider;
  }
}
