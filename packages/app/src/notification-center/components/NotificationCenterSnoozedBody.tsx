import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { osName } from '../../utils/process';

const illuSVG = require('./resources/illustration--focus.svg');

interface Classes {
  illustration: string,
}

interface Props {
  classes?: Classes,
  syncWithOS: boolean,
}

@injectSheet(() => ({
  illustration: {
    marginBottom: 10,
  },
}))
export default class NotificationCenterSnoozedBody extends React.PureComponent<Props, {}> {
  render() {
    const { classes, syncWithOS } = this.props;

    return (
    <div className="l-notification-center__body">
        <div className="l-empty">
          <div className="l-empty__content">
            <div className={classes!.illustration}>
              <img src={illuSVG} alt="focus" />
            </div>

            { syncWithOS ?
              <div>
                <p>
                  To view notifications, switch Do Not Disturb mode off in the {osName} Notification Center.
                  Otherwise, just relax!
                </p>
              </div>
              :
              <div>
                <strong>You are currently on Do Not Disturb mode</strong>
                <p>To view notifications, switch Do Not Disturb off. Otherwise, just relax!</p>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
