import * as React from 'react';
import injectSheet from 'react-jss';

import styles, { AppRequestStepsInputClasses } from './styles';

export interface AppRequestStepsInputComponentProps {
  classes?: AppRequestStepsInputClasses,
  placeholder?: string,
  value?: string,
  error?: string,
  maxlength?: number,
  onValueChange?: (value: string, event: React.FormEvent<HTMLInputElement>) => any,
}

export type AppRequestStepsInputProps = AppRequestStepsInputComponentProps & React.HTMLProps<HTMLInputElement>;

@injectSheet(styles)
export default class AppRequestStepsInput extends React.PureComponent<AppRequestStepsInputProps, {}> {

  handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { onChange, onValueChange } = this.props;
    const value = event.currentTarget.value;
    if (onChange) onChange(event);
    if (onValueChange) onValueChange(value, event);
  }

  render() {
    const { classes, label, error, ...inputProps } = this.props;

    return (
      <div className={classes!.inputWrapper}>
        {error &&
          <span className={classes!.error}>{error}</span>
        }
        <label>
          <input type="text" className={classes!.input} onChange={this.handleChange} {...inputProps}/>
        </label>
      </div>
    );
  }
}
