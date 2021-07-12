import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import * as Immutable from 'immutable';
import { getSnoozeDuration } from '../../notification-center/selectors';

export interface Props {
  snoozed: boolean
}

class NotificationBadgeImpl extends React.PureComponent<Props, {}> {
  render() {
    if (this.props.snoozed) return null;
    return (
      <span className="l-dock__app__notification" />
    );
  }
}

const NotificationBadge = connect(
  (state: Immutable.Map<string, any>) => ({
    snoozed: Boolean(getSnoozeDuration(state)),
  }),
  (dispatch: Dispatch<any>) => bindActionCreators({}, dispatch)
)(NotificationBadgeImpl);

export default NotificationBadge;
