import { ServiceBase } from '../../lib/class';
import { service } from '../../lib/decorator';
import { RPC } from '../../lib/types';

@service('cursor')
export class CursorService extends ServiceBase implements RPC.Interface<CursorService> {
  // @ts-ignore
  setCursor(cursor: string): Promise<void> {}
}
