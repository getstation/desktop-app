import { Duplex } from 'stream';

/**
 * Buffers data until another duplex is connected through `connect` method
 */
export class LazyDuplex extends Duplex {

  duplex?: Duplex;

  connect(duplex: Duplex) {
    this.duplex = duplex;
    duplex.on('data', data => {
      this.push(data);
    });
  }

  _write(chunk: Buffer, _encoding: any, callback: Function) {
    this.duplex!.write(chunk, _encoding, callback);
  }

  _read(_size: any) {
  }
}
