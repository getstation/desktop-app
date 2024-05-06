import { ipc } from '@getstation/sdk';
import { AbstractProvider } from '../../common';

export default class IpcProvider extends AbstractProvider<ipc.IpcConsumer> {
  addConsumer() {
  }
}
