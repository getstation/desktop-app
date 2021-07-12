import { Modal } from '@getstation/theme';
import { remote } from 'electron';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
// @ts-ignore: no declaration file
import { updateUI } from 'redux-ui/transpiled/action-reducer';
import { oc } from 'ts-optchain';
import { StationState } from '../../types';
import { resetApplication, ResetApplicationAction } from '../duck';
import { withGetApplication } from '../queries@local.gql.generated';
import { getUIConfirmResetApplicationModalIsVisible } from '../selectors';

const currentWindowId = remote.getCurrentWindow().id;

interface Classes {
  description: string,
}

interface InputProps {
  applicationId: string,

}
interface StateProps {
  classes?: Classes,
  isVisible: boolean,
}

interface DispatchProps {
  onReset: (applicationId: string) => ResetApplicationAction,
  onCancel: () => void,
}

interface GqlProps {
  applicationName: string | null,
  loading: boolean,
}

type Props = InputProps & StateProps & DispatchProps & GqlProps;

interface State {
}

@injectSheet(() => ({
  description: {
    textAlign: 'center',
    width: '80%',
    margin: 'auto',
  },
}))
class ConfirmResetApplicationImpl extends React.Component<Props, State> {
  constructor(args: Props) {
    super(args);
  }

  render() {
    const { classes, applicationName, applicationId, onReset, onCancel, isVisible, loading } = this.props;

    if (!loading && isVisible) {
      return (
        <Modal
          title={`Reset ${applicationName}`}
          onCancel={onCancel}
          onContinue={() => applicationId && onReset(applicationId)}
          cancelContent={'Cancel'}
          continueContent={'Continue'}
        >
          <p className={classes!.description}>
            This will clear all of {applicationName} pages and send you back home.
          </p>
        </Modal>
      );
    }
    return null;
  }
}

const connector = compose(
  connect<StateProps, DispatchProps, InputProps>(
    (state: StationState) => ({
      isVisible: getUIConfirmResetApplicationModalIsVisible(state, currentWindowId),
    }),
    (dispatch) => bindActionCreators(
      {
        onReset: (applicationId: string) => resetApplication(applicationId, 'help'),
        onCancel: () => updateUI('confirmResetApplicationModal', 'isVisible', false),
      },
      dispatch
    ),
  ),
  withGetApplication({
    options: (props: InputProps & StateProps & DispatchProps) => ({ variables: { applicationId: props.applicationId } }),
    props: ({ data }) => ({
      loading: !data,
      applicationName: oc(data).application.manifestData.name(),
    }),
  }),
);

export default connector(ConfirmResetApplicationImpl);
