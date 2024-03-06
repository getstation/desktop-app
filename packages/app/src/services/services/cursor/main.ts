import { RPC } from '../../lib/types';
import { CursorService } from './interface';
import { sendToAllWebcontents } from '../../../lib/ipc-broadcast';

export class CursorServiceImpl extends CursorService implements RPC.Interface<CursorService> {
  async setCursor(cursor: string): Promise<void> {
    sendToAllWebcontents('ui-setCursorIcon', cursor);
  }
}
