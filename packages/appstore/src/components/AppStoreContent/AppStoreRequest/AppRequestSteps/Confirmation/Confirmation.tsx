import { ApiResponse, Visibility } from '@src/app-request/duck';
import * as React from 'react';
import injectSheet from 'react-jss';
import AppRequestError
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestSteps/AppRequestError/AppRequestError';
import AppRequestStepsButtons
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsButtons/AppRequestStepsButtons';

import styles, { IClasses } from './styles';

interface IStateProps {
  classes?: IClasses,
  name: string,
  logoURL: string,
  themeColor: string,
  visibility: Visibility,
  apiResponse: ApiResponse,
  installApplicationAfterAdd: () => void,
}

interface IDispatchProps {
  onCancel: () => void,
}

export type ConfirmationProps = IStateProps & IDispatchProps;

@injectSheet(styles)
export default class Confirmation extends React.PureComponent<ConfirmationProps, {}> {

  render() {
    const {
      classes,
      name,
      logoURL,
      visibility,
      apiResponse,
      onCancel,
      installApplicationAfterAdd,
    } = this.props;

    if (apiResponse === ApiResponse.Error) {
      return (
        <div className={classes!.stepContainer}>
          <AppRequestError />
          <AppRequestStepsButtons
            isOnContinueBtn={false}
            onCancelBtnText={'Go to App Store'}
            onCancel={onCancel}
          />
        </div>
      );
    }

    if (visibility === Visibility.Public) {
      return (
        <div className={classes!.stepContainer}>
          <div className={classes!.stepContent}>
            <img className={classes!.logo} src={logoURL}/>
            <div className={classes!.appName}>{name}</div>
            <h4 className={classes!.title}>Your submission is complete.</h4>
            <div className={classes!.text}>
              We'll let you know by email when we decide to add {name} to the public app store.
            </div>
          </div>
          <AppRequestStepsButtons
            isOnContinueBtn={false}
            onCancelBtnText={'Go to App Store'}
            onCancel={onCancel}
          />
        </div>
      );
    }

    return (
      <div className={classes!.stepContainer}>
        <div className={classes!.stepContent}>
          <div className={classes!.imageUploadedBg}>
            <img src={logoURL} className={classes!.imageUploaded} />
          </div>
          <h4 className={classes!.appName}>{name}</h4>
          <div className={classes!.text}>Your app has been successfully added<br/>to your app store!</div>
        </div>
        <AppRequestStepsButtons
          onCancelBtnText={'Go to App Store'}
          onContinueBtnText={'Install now'}
          onCancel={onCancel}
          onContinue={installApplicationAfterAdd}
        />
      </div>
    );
  }
}
