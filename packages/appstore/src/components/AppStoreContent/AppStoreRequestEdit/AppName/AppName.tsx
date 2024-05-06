import * as React from 'react';
import injectSheet from 'react-jss';
import AppRequestStepsInput
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsInput/AppRequestStepsInput';

import styles, { IClasses } from './styles';

interface IState {
  appName: string,
}

interface IStateProps {
  classes?: IClasses,
  name: string,
  nameError?: string,
  handleChangeName: (appName: string) => void,
}

export type Props = IStateProps;

@injectSheet(styles)
export default class AppName extends React.PureComponent<Props, IState> {

  constructor(props: Props) {
    super(props);
  }

  onChange = (value: string) => {
    this.props.handleChangeName(value);
  }

  render() {
    const { classes, name, nameError } = this.props;

    return (
      <div className={classes!.stepContainer}>
        <div className={classes!.subTitle}>What's your app name?</div>
          <AppRequestStepsInput
            placeholder={'Company\'s back-office, admin interface...'}
            value={name}
            maxLength={100}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.onChange(e.target.value)}
            error={nameError}
          />
      </div>
    );
  }
}
