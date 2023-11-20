import { Input, InputType, Modal } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { UnlockStep } from '../duck';
import { PasswordManager } from '../types';

export interface Classes {
  body: string,
}

export interface Props {
  classes?: Classes,
  process: any,
  passwordManager: PasswordManager,
  onUnlock: (passwordManager: PasswordManager, payload: any) => void,
  onCancel: () => void,
  providerName: string,
  applicationName: string,
}

export interface State {
  masterPassword: string,
}

@injectSheet(() => ({
  body: {
    paddingBottom: '0 !important',
    '& input': {
      marginBottom: 0,
    },
  },
}))
export default class Unlock extends React.PureComponent<Props, State> {
  constructor(args: Props) {
    super(args);
    this.state = {
      masterPassword: '',
    };

    this.onUnlock = this.onUnlock.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  // tslint:disable-next-line:function-name
  UNSAFE_componentWillUpdate(nextProps: Readonly<Props>) {
    const { process: { step } } = this.props;

    if (step === UnlockStep.Test && nextProps.process.step === UnlockStep.Error) {
      this.setState({ masterPassword: '' });
    }
  }

  handleKeyUp(e: React.KeyboardEvent<HTMLElement>) {
    switch (e.key) {
      case 'Enter': {
        e.preventDefault();
        this.onUnlock();
        break;
      }
      default:
        return;
    }
  }

  onUnlock() {
    const { passwordManager, onUnlock } = this.props;
    onUnlock(passwordManager, this.state);
  }

  render() {
    const { process, classes, providerName, applicationName, onCancel } = this.props;

    return (
      <Modal
        title={`Confirm your ${providerName} password`}
        description={`Do you want to auto fill your ${applicationName} credentials?`}
        onCancel={onCancel}
        onContinue={this.onUnlock}
        continueContent={'Submit'}
        classNameModalBody={classes!.body}
        isLoading={[UnlockStep.Test, UnlockStep.Finish].includes(process.step)}
      >
        <Input
          type={InputType.PASSWORD}
          label={'Your password'}
          autoFocus={true}
          value={this.state.masterPassword}
          error={process.step === UnlockStep.Error ? process.payload : null}
          placeholder={'**********'}
          onChange={(event: any) => this.setState({ masterPassword: event.target.value })}
          onKeyUp={this.handleKeyUp}
        />
      </Modal>
    );
  }
}
