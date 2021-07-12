import * as React from 'react';
import injectSheet from 'react-jss';
import AppRequestStepsButtons
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsButtons/AppRequestStepsButtons';
import AppRequestStepsInput
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsInput/AppRequestStepsInput';

import styles, { IClasses } from './styles';

interface IState {
  appName: string,
  error?: string,
}

interface IStateProps {
  classes?: IClasses,
  name: string,
  animAppearDirection: boolean,
  animExitDirection: boolean,
}

interface IDispatchProps {
  onNext: (appName: string) => void,
}

export type Props = IStateProps & IDispatchProps;

@injectSheet(styles)
export default class AppName extends React.PureComponent<Props, IState> {
  private static minAppNameLength = 2;
  private static defaultState: IState = {
    appName: '',
    error: undefined,
  };

  constructor(props: Props) {
    super(props);
    this.state = { ...AppName.defaultState, appName: props.name || '' };

    this.onChange = this.onChange.bind(this);
    this.onContinue = this.onContinue.bind(this);
  }

  onChange(value: string) {
    const { error } = this.state;
    const errorDerivedFromNewValue = error && this.appNameIsValid(value) ? undefined : error;

    this.setState({ appName: value, error: errorDerivedFromNewValue });
  }

  onContinue() {
    const { onNext } = this.props;
    const { appName } = this.state;

    if (this.appNameIsValid(appName)) {
      onNext(appName);
      this.setState(AppName.defaultState);
      return;
    }

    this.setState({ error: 'Enter an app name' });
  }

  appNameIsValid(value: string) {
    return value.trim().length > AppName.minAppNameLength;
  }

  render() {
    const { classes } = this.props;
    const { appName, error } = this.state;

    return (
      <div className={classes!.stepContainer}>
        <div className={classes!.subTitle}>What's your app name?</div>
        <div className={classes!.inputContainer}>
          <AppRequestStepsInput
            placeholder={'Add a custom app'}
            value={appName && appName}
            maxLength={100}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.onChange(e.target.value)}
            error={error}
          />
        </div>
        <AppRequestStepsButtons
          onContinueBtnText={'Next'}
          onContinue={this.onContinue}
        />
      </div>
    );
  }
}
