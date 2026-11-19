import React from 'react';
import Select, { components } from 'react-select';
import injectSheet, { WithSheet } from 'react-jss';
import { OptionProps } from 'react-select/src/components/Option';
import { NoticeProps } from 'react-select/src/components/Menu';
import { InputActionMeta } from 'react-select/src/types';

import { theme } from '../../jss';
import { IgnoreJSSNested } from '../../types';
import { RoundPicture } from '../RoundPicture';

const styles = {
  roundPicture: {
    marginRight: 12,
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
  select: {
    '& > div': {
      border: (({ error }: OwnProps) => error ? `2px solid ${theme.colors.error} !important` : '1px solid rgba(41, 41, 41, 0.1)') as any,
      color: (({ error }: OwnProps) => error ? theme.colors.error : '#292929') as any,
    },
  },
};

const customStyles = {
  container: (provided: any, _state: any) => ({
    ...provided,
    minWidth: 200,
    padding: 2,
  }),
  control: (provided: any, _state: any) => ({
    ...provided,
    borderRadius: 30,
    fontSize: 12,
    fontWeight: 500,
    border: '1px solid rgba(41, 41, 41, 0.1)',
    color: '#292929',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
  }),
  indicatorSeparator: (provided: any, _state: any) => ({
    ...provided,
    backgroundColor: '#3070cd',
  }),
  indicatorsContainer: (provided: any, _state: any) => ({
    ...provided,
    borderRadius: '0 30px 30px 0',
    backgroundColor: '#3070cd',
  }),
  dropdownIndicator: (provided: any, _state: any) => ({
    ...provided,
    color: 'white !important',
  }),
  menu: (provided: any, state: any) => ({
    ...provided,
    border: '1px solid #c9c9c9',
    boxShadow: '0 5px 10px 0 rgba(0, 0, 0, 0.12)',
    borderRadius: 10,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: 12,
    padding: '5px 20px',
    color: state.isFocused ? 'white' : 'initial',
    backgroundColor: state.isFocused ? '#4f94f8' : 'initial',
  }),
  noOptionsMessage: (provided: any, state: any) => ({
    ...provided,
    fontSize: 12,
  }),
};

interface OwnProps {
  options: SelectInputOption[],
  value: SelectInputOption | null,
  inputValue?: string,
  onChange: (option: SelectInputOption) => void,
  onInputChange?: (value: string, action: InputActionMeta) => void,
  placeholder?: string,
  noOptionsMessage?: string,
  className?: string,
  label?: string,
  error?: string,
  forceHeader?: boolean,
}

export interface SelectInputOption {
  value: string,
  label: string,
  picture?: string,
}

type ValueType<T> = T | ReadonlyArray<T> | null | undefined;

type Props = OwnProps & WithSheet<IgnoreJSSNested<typeof styles>, {}>;

class SelectInputImpl extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  handleChange = (selectedOption: ValueType<SelectInputOption>) => {
    if (!selectedOption || Array.isArray(selectedOption)) return;

    // @ts-ignore TS not able to recognize selectedOption is not a ReadOnlyArray
    // https://github.com/microsoft/TypeScript/issues/17002
    this.props.onChange(selectedOption);
  }

  renderOption = (componentProps: OptionProps<SelectInputOption, false>) => {
    const { data } = componentProps;
    const { classes } = this.props;

    return (
      <components.Option {...componentProps}>
        {data.picture &&
          <RoundPicture
            className={classes.roundPicture}
            item={data}
            size={22}
            borderColor="transparent"
          />
        }
        <div>{data.label}</div>
      </components.Option>
    );
  }

  renderNoOptionsMessage = (componentProps: NoticeProps<SelectInputOption, false>) => {
    const { classes, noOptionsMessage } = this.props;

    return (
      <components.NoOptionsMessage {...componentProps}>
        <p>{noOptionsMessage || 'No options'}</p>
      </components.NoOptionsMessage>
    );
  }

  renderHeader() {
    const { classes, label, error, forceHeader } = this.props;
    if (!forceHeader && !label && !error) return null;

    return (
      <div className={classes!.header}>
        {label
          ? <label className={classes!.label}>{label}</label>
          : <label className={classes!.label}>&nbsp;</label>
        }

        {error &&
        <span className={classes!.error}>{error}</span>
        }
      </div>
    );
  }

  render() {
    const { classes, className, options, placeholder, value } = this.props;

    return (
      <div className={className}>
        {this.renderHeader()}
        <Select<SelectInputOption>
          className={classes.select}
          placeholder={placeholder}
          value={value}
          inputValue={this.props.inputValue}
          onChange={this.handleChange}
          onInputChange={this.props.onInputChange}
          options={options}
          styles={customStyles}
          components={{
            Option: this.renderOption,
            NoOptionsMessage: this.renderNoOptionsMessage,
          }}
        />
      </div>
    );
  }
}

export const SelectInput = injectSheet(
  styles as IgnoreJSSNested<typeof styles>
)(SelectInputImpl) as React.ComponentType<OwnProps>;
