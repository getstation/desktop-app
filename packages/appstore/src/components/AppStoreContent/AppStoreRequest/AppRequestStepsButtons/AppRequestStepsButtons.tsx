import * as React from 'react';
import injectSheet from 'react-jss';

import styles, { AppRequestStepsButtonsClasses } from './styles';

export interface AppRequestStepsButtonsClassesProps {
  classes?: AppRequestStepsButtonsClasses,
  isOnContinueBtn?: boolean,
  onCancelBtnText?: string,
  onContinueBtnText?: string,
  onCancel?: () => void,
  onContinue?: () => void,
  bgColor?: string,
}

@injectSheet(styles)
export default class AppRequestStepsButtons extends React.PureComponent<AppRequestStepsButtonsClassesProps, {}> {

  render() {
    const { classes, isOnContinueBtn = true, onCancel, onContinue, onCancelBtnText, onContinueBtnText } = this.props;

    return (
      <div className={classes!.controlsContainer}>
        {onCancel && <button className={classes!.cancelBtn} onClick={onCancel}>{onCancelBtnText}</button>}
        {isOnContinueBtn &&
        <button className={classes!.onContinueBtn} onClick={onContinue}>
          {onContinueBtnText}
        </button>
        }
      </div>
    );
  }
}
