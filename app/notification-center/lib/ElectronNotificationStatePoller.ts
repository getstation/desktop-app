import { EventEmitter } from 'events';

import services from '../../services/servicesManager';

export default class ElectronNotificationStatePoller extends EventEmitter {
  interval: number;
  intervalId: any;
  state: boolean | null;

  constructor() {
    super();

    const ms = require('ms');
    this.interval = ms('1sec');
    this.intervalId = undefined;
    this.state = null;

    this.start();
  }

  start() {
    this.intervalId = setInterval(() => {
      services.osNotification.isDoNotDisturbEnabled().then(doNotDisturb => {
        if (doNotDisturb !== this.state) {
            this.emit('os-dnd-state', doNotDisturb);
            this.state = doNotDisturb;
        }
      });
    }, this.interval);
  }

  stop() {
    clearInterval(this.intervalId);
  }
}
