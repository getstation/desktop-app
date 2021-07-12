import { EMPTY, Observable } from 'rxjs';

const REGEX_NUDGE_NOTIFICATION = /^👉.*\(sent via.*Station.*\)$/;
const isNudgeNotification = (body: string) => Boolean(body.match(REGEX_NUDGE_NOTIFICATION));

/**
 * Manipulate Station's notifications
 */
export default class NotificationOverride {
  bx: any;

  constructor() {
    this.interceptNewNotification = this.interceptNewNotification.bind(this);
  }

  async activate(bx: any): Promise<Observable<Error>> {
    this.bx = bx;

    await this.interceptNewNotification();
    return EMPTY;
  }

  deactivate() {
    // TODO empty middleware stack
  }

  private async interceptNewNotification() {
    const { notifications } = this.bx;
    // FIXME Here we receive notifications of ALL apps
    // TODO by default, receive only Notifications for current App (i.e. Slack in this case)
    notifications.intercept('new', (e, a) => {
      if (!a.applicationId || !a.applicationId.startsWith('slack-')) return;
      if (isNudgeNotification(a.props.body)) {
        // Do not trigger notification if it's a nudge
        e.preventDefault();
      }
      // Add { silent: true } option
      return {
        ...a,
        options: {
          ...a.options,
          silent: true,
        },
      };
    });
  }
}
