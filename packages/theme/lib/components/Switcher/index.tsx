import classNames = require('classnames');
import * as React from 'react';
import injectSheet, { CSSProperties, WithSheet } from 'react-jss';
import * as shortid from 'shortid';
import { IgnoreJSSNested } from '../../types';
import { Tooltip } from '../Tooltip';

export enum TEXT {
  ON_OFF,
  YES_NO,
}

interface OwnProps {
  disabledHint?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
  text?: TEXT;
  disabled?: boolean;
}

const transition = {
  transition: 'all 500ms ease-in-out',
};

const styles = {
  hint: {
    width: 'initial',
    maxWidth: 200,
    marginTop: 20,
    marginRight: 5,
  },
  switcher: {
    display: 'flex',
    height: '100%',
    position: 'relative',
    width: '200%',
    ...transition,
  },
  button: ((props: OwnProps): CSSProperties<OwnProps> => ({
    backgroundSize: '100%',
    background: 'gray',
    boxSizing: 'border-box',
    position: 'absolute',
    top: '4px',
    left: 48,
    width: 11,
    height: 11,
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    borderRadius: '100%',
    ...transition,
  })) as any,
  content: {
    background: 'gray',
    display: 'inline-block',
    float: 'left',
    height: '100%',
    width: '64px',
    fontSize: '9px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    top: '10px',
    ...transition,
    '& span': {
      height: '100%',
      lineHeight: '20px',
      float: 'left',
    },
  },
  contentLeft: {
    backgroundImage:
      'linear-gradient(180deg, #213655 0%, #385679 34.24%, #4A7496 79.87%, #7272A0 100%)',
    backgroundSize: '100%',
    '& span': {
      marginRight: '20px',
      float: 'right',
    },
  },
  contentRight: {
    backgroundColor: 'white',
    color: 'gray',
    backgroundSize: '100%',
    '& span': {
      marginLeft: '18px',
      display: 'inline-block',
      width: 22,
      textAlign: 'center',
    },
  },
  viewport: ((props: OwnProps): CSSProperties<OwnProps> => ({
    boxSizing: 'content-box',
    display: 'block',
    width: '44px',
    height: '19px',
    overflow: 'hidden',
    position: 'relative',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    borderRadius: '40px',
    color: '#fff',
    float: 'right',
    userSelect: 'none',
    border: '1px solid #EEE',
  })) as any,
  toggle: {
    display: 'none',
    visibility: 'hidden',
    '& + $viewport > $switcher': {
      left: '-100%',
    },
    '& + $viewport > $button': {
      left: 48,
    },
    '& + $viewport > $content': {
      left: '65px',
    },
    '& + $viewport > $contentLeft': {
      marginLeft: 0,
    },
    '&:checked + $viewport > $switcher': {
      left: 0,
    },
    '&:checked + $viewport $button': {
      left: 28,
      color: 'white',
      backgroundColor: 'white',
    },
    '&:disabled + $viewport $button': {
      opacity: 0.5,
    },
    '&:checked + $viewport $contentLeft': {
      marginLeft: 0,
    },
    '&:disabled + $viewport $content': {
      color: '#C9C9C9',
      background: 'white',
    },
    '&:disabled:checked + $viewport $content': {
      color: '#C9C9C9',
      background: 'white',
    },
    '&:disabled:checked + $viewport $button': {
      backgroundColor: '#C9C9C9',
    },
  },
};

type Props = OwnProps & WithSheet<IgnoreJSSNested<typeof styles>, {}>;

class SwitcherImpl extends React.PureComponent<Props, {}> {
  static defaultProps = {
    text: TEXT.ON_OFF,
    onChange: () => {},
    checked: false,
    disabled: false,
    disabledHint: '',
  };

  inputId: string;
  values: any;

  constructor(props: Props) {
    super(props);
    this.inputId = `switcher-input-${shortid.generate()}`;
    this.values = {
      [TEXT.ON_OFF]: { 0: 'off', 1: 'on' },
      [TEXT.YES_NO]: { 0: 'no', 1: 'yes' },
    };
  }

  render() {
    const { classes, checked, onChange, disabled, text, disabledHint } = this.props;

    const hint = disabled ? disabledHint : '';
    const values = this.values[text!];

    return (
      <div>
        <Tooltip hintClassname={classes.hint} tooltip={hint}>
          <input
            type="checkbox"
            id={this.inputId}
            className={classes.toggle}
            checked={checked}
            disabled={disabled}
            onChange={onChange}
          />
          <label className={classes.viewport} htmlFor={this.inputId}>
            <div className={classes.switcher}>
              <div className={classes.button}>&nbsp;</div>
              <div className={classNames(classes.content, classes.contentLeft)}>
                <span>{values[1]}</span>
              </div>
              <div className={classNames(classes.content, classes.contentRight)}>
                <span>{values[0]}</span>
              </div>
            </div>
          </label>
        </Tooltip>
      </div>
    );
  }
}

export const Switcher = injectSheet(styles as IgnoreJSSNested<typeof styles>)(SwitcherImpl);
