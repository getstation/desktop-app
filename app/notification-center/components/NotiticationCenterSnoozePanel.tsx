import * as React from 'react';
import injectSheet from 'react-jss';
import NotificationCenterSnoozePanelItem from './NotiticationCenterSnoozePanelItem';
import { minutesBeforeHeightAm } from '../utils';

export interface Classes {
  container: string,
  title: string,
  list: string,
}

export interface Props {
  classes?: Classes,
  handleSnooze: (duration: string) => any,
}

const styles = (theme: any) => ({
  container: {
    backgroundColor: 'white',
    borderRadius: 4,
    boxShadow: '1px 1px 5px 0px rgba(50, 50, 50, 0.75)',
    padding: [6, 10],
    minWidth: '100px',
    marginTop: 5,
  },
  title: {
    color: theme.colors.gray.dark,
    fontWeight: 700,
  },
  list: {
    marginTop: 6,
  },
});

@injectSheet(styles)
class NotificationCenterSnoozePanel extends React.PureComponent<Props, {}> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes!.container}>
        <span className={classes!.title}>Do Not Disturb for</span>
        <ul className={classes!.list}>
          <NotificationCenterSnoozePanelItem
            handleClick={() => this.props.handleSnooze('21min')}
            duration="20 minutes"
          />
          <NotificationCenterSnoozePanelItem
            handleClick={() => this.props.handleSnooze('61min')}
            duration="1 hour"
          />
          <NotificationCenterSnoozePanelItem
            handleClick={() => this.props.handleSnooze('121min')}
            duration="2 hours"
          />
          <NotificationCenterSnoozePanelItem
            handleClick={() => this.props.handleSnooze('241min')}
            duration="4 hours"
          />
          <NotificationCenterSnoozePanelItem
            handleClick={() => this.props.handleSnooze(`${minutesBeforeHeightAm()}min`)}
            duration="Until tomorrow"
          />
          <NotificationCenterSnoozePanelItem
            handleClick={() => this.props.handleSnooze('INFINITE')}
            duration="Always"
          />
        </ul>
      </div>
    );
  }
}

export default NotificationCenterSnoozePanel;
