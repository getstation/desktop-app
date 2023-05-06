import { EventEmitter } from 'events';
import ms = require('ms');
import { getDoNotDisturb } from '@stack-inc/electron-notification-state';

export default class ElectronNotificationStatePoller extends EventEmitter {
  interval: number;
  intervalId: any;
  state: boolean | null;

  constructor() {
    super();

    this.interval = ms('1sec');
    this.intervalId = undefined;
    this.state = null;

    this.start();
  }

  start() {
    this.intervalId = setInterval(() => {
      if (getDoNotDisturb() !== this.state) {
        this.emit('os-dnd-state', getDoNotDisturb());
        this.state = getDoNotDisturb();
      }
    }, this.interval);
  }

  stop() {
    clearInterval(this.intervalId);
  }
}
