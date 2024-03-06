import * as React from 'react';
import { connect } from 'react-redux';
import { Action, bindActionCreators, Dispatch } from 'redux';
import * as Immutable from 'immutable';
import { toggleVisibility } from './duck';
import { getNotifications, getSnoozeDuration, isVisible } from './selectors';
import NativeAppDockIcon, { IconSymbol } from '../dock/components/NativeAppDockIcon';

interface StateToProps {
  snoozeDuration: string | undefined,
  badge: number
  active: boolean
}
interface DispatchToProps {
  onClick: () => Action,
}

class NotificationCenterDockIconImpl extends React.PureComponent<StateToProps & DispatchToProps, {}> {

  render() {
    const { snoozeDuration, onClick, badge, active } = this.props;

    return (
      <NativeAppDockIcon
        className="appcues-subdock-notification-center"
        iconSymbolId={IconSymbol.NOTIFICATION}
        onClick={onClick}
        badge={(badge > 0) && !Boolean(snoozeDuration)}
        active={active}
        tooltip={active ? undefined : 'Notifications'}
      />
    );
  }
}

const NotificationCenterDockIcon = connect<StateToProps, DispatchToProps, {}>(
  (state: Immutable.Map<string, any>) => ({
    snoozeDuration: getSnoozeDuration(state),
    badge: getNotifications(state).size,
    active: isVisible(state),
  }),
  (dispatch: Dispatch) => bindActionCreators({
    onClick: toggleVisibility,
  }, dispatch)
)(NotificationCenterDockIconImpl);

export default NotificationCenterDockIcon;
