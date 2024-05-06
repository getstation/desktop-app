import * as Immutable from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { Action, bindActionCreators, Dispatch } from 'redux';
import FocusModeDockIcon from './components/FocusModeDockIcon';
import { INFINITE, SYNC_WITH_OS } from './constants';
import { resetSnoozeDuration, ResetSnoozeDurationAction, setSnoozeDuration, SetSnoozeDurationAction } from './duck';
import { getSnoozeDuration, getSnoozeDurationInMs, getSnoozeState } from './selectors';

interface StateFromProps {
  currentSnoozeDuration: string | undefined,
  currentSnoozeDurationInMs: number | string | undefined,
  isSnoozed: boolean,
}

interface DispatchFromProps {
  setSnooze: (duration: string) => SetSnoozeDurationAction,
  resetSnooze: () => ResetSnoozeDurationAction,
}

type Props = StateFromProps & DispatchFromProps;

class FocusModeDockContainerImpl extends React.PureComponent<Props, {}> {
  constructor(props: Props) {
    super(props);

    this.handleSnooze = this.handleSnooze.bind(this);
  }

  handleSnooze() {
    const { currentSnoozeDuration, setSnooze, resetSnooze, isSnoozed } = this.props;
    if (currentSnoozeDuration === SYNC_WITH_OS) return;
    isSnoozed ? resetSnooze() : setSnooze(INFINITE);
  }

  render() {
    const syncWithOS = this.props.currentSnoozeDuration === SYNC_WITH_OS;

    return (
      <FocusModeDockIcon
        onClick={this.handleSnooze}
        isSnoozed={this.props.isSnoozed}
        syncWithOS={syncWithOS}
      />
    );
  }
}

const FocusModeDockContainer = connect<StateFromProps, DispatchFromProps, {}>(
  (state: Immutable.Map<string, any>) => ({
    currentSnoozeDuration: getSnoozeDuration(state),
    currentSnoozeDurationInMs: getSnoozeDurationInMs(state),
    isSnoozed: getSnoozeState(state),
  }),
  (dispatch: Dispatch<Action>) => bindActionCreators(
    {
      setSnooze: (duration: string) => setSnoozeDuration('dock-icon', duration),
      resetSnooze: () => resetSnoozeDuration('dock-icon'),
    },
    dispatch
  )
)(FocusModeDockContainerImpl);

export default FocusModeDockContainer;
