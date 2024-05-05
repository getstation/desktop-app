// @ts-ignore: no declaration file
import { disableSslCertVerification } from '../../../app/duck';
import { StationStoreWorker } from '../../../types';
import { RPC } from '../../lib/types';
import { SessionProviderService } from './interface';

export class SessionProviderServiceImpl extends SessionProviderService implements RPC.Interface<SessionProviderService> {
  store: StationStoreWorker;

  constructor(store: StationStoreWorker, uuid?: string) {
    super(uuid);
    this.store = store;
  }

  async disableSslCertVerification(partition: string) {
    this.store.dispatch(disableSslCertVerification(partition));
  }
}
