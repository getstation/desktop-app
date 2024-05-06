import { ThemeTypes as Theme, ButtonIcon, IconSymbol, Size, Style } from '@getstation/theme';
import * as moment from 'moment';
import * as React from 'react';
import injectSheet from 'react-jss';
import { osName } from '../../utils/process';
import { INFINITE, SYNC_WITH_OS } from '../constants';
import NotificationCenterSnoozeButton from './NotificationCenterSnoozeButton';
import SnoozeDuration from './SnoozeDuration';
import ms = require('ms');

export interface Classes {
  container: string,
  wrapper: string,
  icon: string,
  buttonsContainer: string,
  markAllAsReadButton: string,
  duration: string,
}

export interface Props {
  classes?: Classes,
  handleSnooze: (snoozeDuration: string) => any,
  handleResetSnooze: () => any,
  currentSnoozeDuration?: string,
  currentSnoozeStartedOn?: number,
  markAllRead: () => any,
}

const styles = (theme: Theme) => ({
  container: {
    padding: [10, 20],
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottom: '1px solid rgba(255, 255, 255, .1)',
    fontSize: 12,
    // to make sure alignement with dock
    paddingBottom: '13px',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '14px',
    minHeight: '52px',
    display: 'flex',
  },
  wrapper: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    // color: (props: Props) =>
    //   !!props.currentSnoozeDuration ? theme.colors.gray.dark : 'inherit',
    // backgroundColor: (props: Props) =>
    //   !!props.currentSnoozeDuration ? 'white' : 'transparent',
  },
  buttonsContainer: {
    display: 'flex',
  },
  markAllAsReadButton: {
    height: 25,
    marginLeft: 10,
  },
  duration: {
    marginBottom: -4,
  },
});

@injectSheet(styles)
class NotificationCenterHeader extends React.PureComponent<Props, {}> {
  constructor(props: Props) {
    super(props);

    this.getSnoozeDurationInMs = this.getSnoozeDurationInMs.bind(this);
  }

  getSnoozeDurationInMs() {
    const { currentSnoozeDuration } = this.props;

    if (currentSnoozeDuration === SYNC_WITH_OS) return SYNC_WITH_OS;
    if (currentSnoozeDuration === INFINITE) return INFINITE;

    return currentSnoozeDuration ? ms(currentSnoozeDuration) : undefined;
  }

  render() {
    const {
      classes, currentSnoozeStartedOn, handleSnooze,
      handleResetSnooze, markAllRead,
    } = this.props;

    const snoozeDurationInMs = this.getSnoozeDurationInMs();
    const syncWithOS = snoozeDurationInMs === SYNC_WITH_OS;
    const snoozeInfinite = snoozeDurationInMs === INFINITE;

    const endDate = currentSnoozeStartedOn && !syncWithOS && !snoozeInfinite ?
      moment(currentSnoozeStartedOn).add(snoozeDurationInMs, 'ms') : null;

    return (
      <div className={classes!.container}>
        <div className={classes!.wrapper}>
          <div>
            { syncWithOS ?
              <div>{osName} is in <em>Do Not Disturb</em> mode</div>
            :
              <div>Do Not Disturb</div>
            }

            { endDate && !syncWithOS && !snoozeInfinite &&
              <div className={classes!.duration}>
                <b><SnoozeDuration snoozeEndDate={endDate} /></b>
              </div>
            }
          </div>

          <div className={classes!.buttonsContainer}>
            { !syncWithOS &&
              <NotificationCenterSnoozeButton
                currentSnoozeDurationInMs={snoozeDurationInMs}
                currentSnoozeStartedOn={currentSnoozeStartedOn}
                handleSnooze={handleSnooze}
                handleResetSnooze={handleResetSnooze}
              />
            }

            { !syncWithOS &&
              <ButtonIcon
                className={classes!.markAllAsReadButton}
                symbolId={IconSymbol.MARK_READ}
                btnStyle={Style.SECONDARY}
                btnSize={Size.XSMALL}
                disabled={Boolean(endDate)}
                onClick={markAllRead}
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default NotificationCenterHeader;
