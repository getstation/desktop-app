import * as React from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { bindActionCreators } from 'redux';

import { getThemeColors } from '../theme/selectors';
import { StationState } from '../types';

import DialogItem from './components/DialogItem';
import { clickDialog } from './duck';
import { getDialogId } from './get';
import { getExtendedDialogs } from './selectors';
import { ExtendedDialogItemsImmutable } from './types';

export interface Props {
  dialogs: ExtendedDialogItemsImmutable,
  onClickDialog: typeof clickDialog,
  themeColor: string,
}

class DialogImpl extends React.PureComponent<Props, {}> {
  handleClickDialog = this.props.onClickDialog;

  render() {
    const { dialogs, themeColor } = this.props;

    return (
      <div className="dialog-toaster__wrapper">
        <TransitionGroup>
          {
            dialogs.map((dialog) =>
              <CSSTransition
                key={getDialogId(dialog)}
                classNames="rapidfade"
                timeout={{ enter: 500, exit: 300 }}
              >
                <DialogItem
                  dialog={dialog}
                  onClickDialog={this.handleClickDialog}
                  themeColor={themeColor}
                />
              </CSSTransition>
            ).toArray()
          }
        </TransitionGroup>
      </div>
    );
  }
}

const Dialog = connect(
  (state: StationState) => ({
    dialogs: getExtendedDialogs(state),
    themeColor: getThemeColors(state)[3],
  }),
  dispatch => bindActionCreators(
    {
      onClickDialog: clickDialog,
    },
    dispatch,
  )
)(DialogImpl);

export default Dialog;
