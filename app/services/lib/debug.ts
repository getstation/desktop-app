import { ServicePeerHandler } from './class';
const throttle = require('lodash.throttle');

export class Debugger {
  warnAfter: number;

  protected sph: ServicePeerHandler;
  protected lastDump: Date;
  protected interval: number;
  protected dumpThrottled: this['dump'];

  constructor(sph: ServicePeerHandler, warnAfter: number = 180, interval: number = 10) {
    this.sph = sph;
    this.warnAfter = warnAfter;
    this.interval = interval * 1000;
    this.dumpThrottled = throttle(this.dump.bind(this), 2000);
  }

  check() {
    if (this.sph.connectedServices.size > this.warnAfter) {
      this.dumpThrottled();
    }
  }

  dump() {
    console.warn(this.sph.connectedServices.size, 'Services are instanciated');

    if (!this.lastDump || (this.lastDump.getTime() + this.interval) < Date.now()) {
      console.table(Array.from(this.sph.connectedServices.keys()).map(uri => ({
        'Service URI': uri,
      })));
      this.lastDump = new Date();
    }
  }
}
