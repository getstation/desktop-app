import { ThemeTypes as Theme } from '@getstation/theme';
import * as Immutable from 'immutable';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { bindActionCreators, Dispatch } from 'redux';
import { osName } from '../utils/process';
import NotificationCenterHeader from './components/NotificationCenterHeader';
import { SYNC_WITH_OS } from './constants';
import {
  markAllAsRead,
  MarkAllAsReadAction,
  resetSnoozeDuration,
  ResetSnoozeDurationAction,
  setSnoozeDuration,
  SetSnoozeDurationAction,
} from './duck';
import NotificationCenterBody from './NotificationCenterBody';
import { getSnoozeDuration, getSnoozeStartedOn } from './selectors';

export interface Props {
  markAllAsRead: () => MarkAllAsReadAction,
  snooze: (duration: string) => SetSnoozeDurationAction,
  resetSnooze: () => ResetSnoozeDurationAction,
  currentSnoozeDuration?: string,
  currentSnoozeStartedOn?: number,
  classes?: {
    infoBox: string,
  }
}

@injectSheet((theme: Theme) => ({
  infoBox: {
    margin: [10, 10, 0, 10],
    padding: 10,
    ...theme.fontMixin(10),
    backgroundColor: 'rgba(255, 255, 255, .2)',
    borderRadius: 3,
    color: 'rgba(255, 255, 255, .6)',
  },
}))
class NotificationCenterSubdockContentImpl extends React.PureComponent<Props, {}> {
  render() {
    const {
      classes, snooze, resetSnooze, currentSnoozeDuration, currentSnoozeStartedOn,
    } = this.props;
    const syncWithOS = currentSnoozeDuration === SYNC_WITH_OS;

    return (
      <div>
        <NotificationCenterHeader
          handleSnooze={snooze}
          handleResetSnooze={resetSnooze}
          currentSnoozeDuration={currentSnoozeDuration}
          currentSnoozeStartedOn={currentSnoozeStartedOn}
          markAllRead={this.props.markAllAsRead}
        />

        {syncWithOS &&
        <div className={classes!.infoBox}>
          To receive notifications, Switch off Do Not Disturb mode in {osName}.
        </div>
        }

        <CSSTransition
          classNames="all-read-animation"
          timeout={{ enter: 700, exit: 500 }}
        >
          <NotificationCenterBody />
        </CSSTransition>
      </div>
    );
  }
}

const NotificationCenterSubdockContent = connect(
  (state: Immutable.Map<string, any>) => ({
    currentSnoozeDuration: getSnoozeDuration(state),
    currentSnoozeStartedOn: getSnoozeStartedOn(state),
  }),
  (dispatch: Dispatch<any>) => bindActionCreators(
    {
      markAllAsRead,
      snooze: (duration: string) => setSnoozeDuration('notification-center', duration),
      resetSnooze: () => resetSnoozeDuration('notification-center'),
    },
    dispatch
  )
)(NotificationCenterSubdockContentImpl);

export default NotificationCenterSubdockContent;
