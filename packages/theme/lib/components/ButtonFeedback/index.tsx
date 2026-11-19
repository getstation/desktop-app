import classNames from 'classnames';
import * as React from 'react';
import injectSheet, { WithSheet } from 'react-jss';
import { ThemeTypes } from '../../types';
import { Button, ButtonProps } from '../Button';

interface State {
  sent: boolean,
}

const styles = (theme: ThemeTypes) => ({
  button: {
    transition: 'background-color .6s',
    overflow: 'hidden',
    '&.sent': {
      backgroundColor: '#64bf6f !important',
    },
    '& > *': {
      display: 'block',
      overflow: 'hidden',
      height: 'inherit',
    },
    // content span
    '& > *:not(.sentSpan)': {
      ...theme.mixins.flexbox.containerCenter,
      transition: 'transform .6s',
      transform: 'translateY(-100%)',
    },
    '&.sent > *:not(.sentSpan)': {
      transform: 'translateY(0)',
    },
    // sent span
    '& .sentSpan': {
      ...theme.mixins.flexbox.containerCenter,
      transition: 'transform .6s, color .6s',
      transform: 'translateY(-100%)',
      color: 'white',
    },
    '&.sent .sentSpan': {
      transform: 'translateY(0)',
    },
  },
});

type Props = ButtonProps & WithSheet<typeof styles>;

class ButtonFeedbackImpl extends React.PureComponent<Props, State> {

  protected feedbackTimeout: any;

  constructor(props: Props) {
    super(props);

    this.state = {
      sent: false,
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
    clearTimeout(this.feedbackTimeout);
    this.setState({ sent: true });
    this.feedbackTimeout = setTimeout(() => {
      this.setState({ sent: false });
    }, 2500);
  }

  render() {
    const { children, className, classes, ...buttonProps } = this.props;
    const { sent } = this.state;

    const child = (typeof children === 'string') ?
      <span>{children}</span> : React.Children.only(children);

    return (
      <Button
        className={classNames(className, classes.button, { sent })}
        onClick={this.onClick}
        {...buttonProps}
      >
        <span className="sentSpan">Sent</span>
        {child}
      </Button>
    );
  }
}

export const ButtonFeedback = injectSheet(styles)(ButtonFeedbackImpl);
