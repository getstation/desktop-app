import * as React from 'react';
import { connect } from 'react-redux';
import { Action, bindActionCreators, Dispatch } from 'redux';
import DockApplicationSubdock from '../common/containers/DockApplicationSubdock';
import { StationState } from '../types';
import { setVisibility } from './duck';
import NotificationCenterDockIcon from './NotificationCenterDockIcon';
import NotificationCenterSubdockContent from './NotificationCenterSubdockContent';
import { isVisible } from './selectors';

interface StateFromProps {
  active: boolean
}
interface DispatchFromProps {
  closeNotificationCenter: () => Action
}
class NotificationCenterImpl extends React.PureComponent<StateFromProps & DispatchFromProps, {}> {

  render() {
    const { active, closeNotificationCenter } = this.props;
    return (
      <DockApplicationSubdock
        open={active}
        onRequestClose={closeNotificationCenter}
      >
        <NotificationCenterDockIcon/>
        <NotificationCenterSubdockContent />
      </DockApplicationSubdock>
    );
  }
}

export default connect<StateFromProps, DispatchFromProps, {}>(
  (state: StationState) => ({
    active: isVisible(state),
  }),
  (dispatch: Dispatch<Action>) => bindActionCreators(
    {
      closeNotificationCenter: () => setVisibility(false),
    },
    dispatch
  )
)(NotificationCenterImpl);
