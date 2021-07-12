import ms = require('ms');
import { EMPTY, Observable } from 'rxjs';
// @ts-ignore
import * as slack from '@getstation/slack';

/**
 * Will synchronize Slack's snooze with Station's snooze
 */
export default class SnoozeSynchronizer {
  bx: any;

  constructor() {
    this.handleSnoozeSet = this.handleSnoozeSet.bind(this);
    this.handleSnoozeReset = this.handleSnoozeReset.bind(this);
  }

  async activate(bx: any): Promise<Observable<Error>> {
    this.bx = bx;
    const { snooze } = this.bx;

    snooze.on('set', this.handleSnoozeSet);
    snooze.on('reset', this.handleSnoozeReset);
    return EMPTY;
  }

  deactivate() {
    const { snooze } = this.bx;
    snooze.removeListener('set', this.handleSnoozeSet);
    snooze.on('reset', this.handleSnoozeReset);
  }

  private async handleSnoozeSet(duration: string) {
    // convert for Slack
    const durationMs = ms(duration);
    // if not duration let's make it 24h
    const numMinutes = durationMs ? durationMs / (1000 * 60) : 24 * 60;

    // get tokens from Slack
    const tokens = await this.bx.slack.getAPITokens();

    // set sooze on Slack side
    tokens.forEach(({ token }: { token: string }) => {
      slack.dnd.setSnooze({ token, num_minutes: numMinutes });
    });
  }

  private async handleSnoozeReset() {
    // get tokens from Slack
    const tokens = await this.bx.slack.getAPITokens();

    // set sooze on Slack side
    tokens.forEach(({ token }: { token: string }) => {
      slack.dnd.endSnooze({ token });
    });
  }
}
