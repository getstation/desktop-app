import * as Immutable from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose, Dispatch } from 'redux';

import { askEnableNotifications } from '../../applications/duck';
import { RequestForApplicationNotificationsStep } from '../duck';
import { getNotificationsRequests } from '../selectors';
import AskAuthorizeNotification from './AskAuthorizeNotifications';

export interface Props {
  notificationsRequests: Immutable.List<any>
  onAnswer: (step: RequestForApplicationNotificationsStep) => void,
}

export interface State {
  currentNotificationsRequest?: Immutable.Map<string, any>,
}

class AskAuthorizeNotificationsApplicationImpl extends React.PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      currentNotificationsRequest: undefined,
    };
  }

  componentDidUpdate(_prevProps: Props, _prevState: State) {
    const { notificationsRequests } = this.props;
    const { currentNotificationsRequest } = this.state;

    const notificationHasBeenNegotiated = !notificationsRequests.find(r => r === currentNotificationsRequest);
    const hasNotificationsRequests = notificationsRequests.size > 0;

    if (notificationHasBeenNegotiated) {
      if (hasNotificationsRequests) {
        this.setState({ currentNotificationsRequest: notificationsRequests.get(0) });
      } else {
        this.setState({ currentNotificationsRequest: undefined });
      }
    } else if (!currentNotificationsRequest && hasNotificationsRequests) {
      this.setState({ currentNotificationsRequest: notificationsRequests.get(0) });
    }
  }

  onAnswer(step: RequestForApplicationNotificationsStep) {
    const { onAnswer } = this.props;
    const { currentNotificationsRequest } = this.state;
    if (!currentNotificationsRequest) return;
    const updatedCurrentNotificationRequest = currentNotificationsRequest.update('askEnableNotification',
      enableNotification => enableNotification.set('step', step));
    onAnswer(updatedCurrentNotificationRequest.get('askEnableNotification').toJS());
  }

  onContinue = () => {
    this.onAnswer(RequestForApplicationNotificationsStep.ENABLE);
  }

  onCancel = () => {
    this.onAnswer(RequestForApplicationNotificationsStep.DISABLE);
  }

  render() {
    const { currentNotificationsRequest } = this.state;

    if (!currentNotificationsRequest) return (null);

    return (
      <AskAuthorizeNotification
        applicationId={currentNotificationsRequest.get('applicationId')}
        onContinue={this.onContinue}
        onCancel={this.onCancel}
      />
    );
  }
}

const connector = compose(
  connect<any, any, {}>(
    (state: Immutable.Map<string, any>) => ({
      notificationsRequests: getNotificationsRequests(state),
    }),
    (dispatch: Dispatch<any>) => bindActionCreators({
      onAnswer: (notificationRequest) => askEnableNotifications(notificationRequest),
    }, dispatch)
  ),
);

export default connector(AskAuthorizeNotificationsApplicationImpl);
