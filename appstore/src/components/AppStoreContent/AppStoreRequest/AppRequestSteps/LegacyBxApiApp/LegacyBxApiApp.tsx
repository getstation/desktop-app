import * as React from 'react';
import injectSheet from 'react-jss';
import AppRequestStepsButtons
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsButtons/AppRequestStepsButtons';

import styles, { IClasses } from './styles';

interface IStateProps {
  classes?: IClasses,
}

interface IDispatchProps {
  onClose: () => void,
}

type Props = IStateProps & IDispatchProps;

@injectSheet(styles)
export default class LegacyBxApiApp extends React.PureComponent<Props, {}> {
  render() {
    const { classes, onClose } = this.props;

    return (
      <div className={classes!.stepContainer}>
        <div className={classes!.stepContent}>
          <div className={classes!.text}>
            You are using an outdated version of Station with missing features. Stay safe and restart your Station.
          </div>
        </div>
        <AppRequestStepsButtons
          isOnContinueBtn={false}
          onCancelBtnText={'Close'}
          onCancel={onClose}
        />
      </div>
    );
  }
}
