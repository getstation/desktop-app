import { theme } from '../../jss';
import classNames from 'classnames';
import * as React from 'react';
import injectSheet, { WithSheet } from 'react-jss';
import { IgnoreJSSNested } from '../../types';

export enum InputSize {
  BIG, NORMAL, SMALL, XSMALL, XXSMALL,
}

export enum InputType {
  TEXT = 'text',
  PASSWORD = 'password',
}

interface OwnProps {
  sheet?: any,
  className?: string,
  inputClassName?: string,
  inputSize?: InputSize,
  forceHeader?: boolean, // default to true
  label?: string,
  error?: string,
  onValueChange?: (value: string, event: React.FormEvent<HTMLInputElement>) => any,
  refInput?: (inputEl: HTMLInputElement) => any,
}

const styles = {
  container: {
    maxWidth: 500,
  },
  input: {
    display: 'block',
    appearance: 'none',
    border: (({ error }: OwnProps) => error ? `2px solid ${theme.colors.error}` : '1px solid rgba(41, 41, 41, 0.1)') as any,
    padding: [0, 15] as any,
    boxSizing: 'border-box',
    borderRadius: 30,
    minWidth: 200,
    width: '100%',
    height: 34,
    lineHeight: '34px',
    ...theme.fontMixin(11, 500),
    transition: 'all 250ms ease-out',
    color: (({ error }: OwnProps) => error ? theme.colors.error : '#292929') as any,
    backgroundColor: '#FFFFFF',
    '&:disabled': {
      opacity: 0.4,
    },
    '&:focus': {
      outline: 'none',
    },
    '&::-webkit-input-placeholder': {
      color: 'rgba(1, 1, 1, 0.3)',
    },
  },
  inputXSmall: {
    height: '24px',
    lineHeight: '24px',
  },
  inputXXSmall: {
    height: '20px',
    lineHeight: '20px',
    padding: '0 10px',
  },
  inputSmall: {
    height: '30px',
    lineHeight: '30px',
  },
  inputBig: {
    fontSize: '13px',
    height: '42px',
    lineHeight: '42px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  label: {
    display: 'block',
    margin: [0, 0, 8, 5] as any,
    ...theme.fontMixin(12),
    color: (({ error }: OwnProps) => error ? theme.colors.error : theme.colors.gray.middle) as any,
  },
  error: {
    ...theme.fontMixin(10, 'bold'),
    color: theme.colors.error,
    textAlign: 'right',
    padding: [0, 5, 8, 10] as any,
  },
};

type Props = OwnProps & WithSheet<IgnoreJSSNested<typeof styles>, {}> & React.HTMLProps<HTMLInputElement>;

class InputImpl extends React.Component<Props, {}> {

  public static defaultProps: Partial<Props> = {
    forceHeader: true,
    inputSize: InputSize.NORMAL,
    refInput: () => {},
  };

  constructor(props: Props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: React.FormEvent<HTMLInputElement>) {
    const { onChange, onValueChange } = this.props;
    const value = event.currentTarget.value;
    if (onChange) onChange(event);
    if (onValueChange) onValueChange(value, event);
  }

  renderHeader() {
    const { classes, label, error, forceHeader } = this.props;
    if (!forceHeader && !label && !error) return null;

    return (
      <div className={classes!.header}>
        {label ?
          <label className={classes!.label}>{label}</label>
          :
          <label className={classes!.label}>&nbsp;</label>
        }

        {error &&
        <span className={classes!.error}>{error}</span>
        }
      </div>
    );
  }

  render() {
    const { classes, inputClassName, className, inputSize, label, error, refInput,
            forceHeader, onValueChange, ...inputProps } = this.props;

    const sizeClassNames = {
      [InputSize.XXSMALL]: classes!.inputXXSmall,
      [InputSize.XSMALL]: classes!.inputXSmall,
      [InputSize.SMALL]: classes!.inputSmall,
      [InputSize.NORMAL]: '',
      [InputSize.BIG]: classes!.inputBig,
    };

    const _inputClassName = classNames(classes!.input, sizeClassNames[inputSize!], inputClassName);

    return (
      <div className={classNames(classes!.container, className)}>
        {this.renderHeader()}
        <input ref={refInput} className={_inputClassName} onChange={this.handleChange} {...inputProps}>
          {this.props.children}
        </input>
      </div>
    );
  }
}

export const Input = injectSheet(styles as IgnoreJSSNested<typeof styles>)(InputImpl);
