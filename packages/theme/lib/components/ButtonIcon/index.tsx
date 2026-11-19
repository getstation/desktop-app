import classNames from 'classnames';
import * as React from 'react';
import injectSheet from 'react-jss';
import { Button, ButtonProps, Icon, IconSymbol, Size } from '../..';

// outer props
export type ButtonIconProps = ButtonProps & {
  iconColor?: string,
  iconPosition?: 'Left' | 'Right',
  iconClassName?: string,
  symbolId: IconSymbol,
  text?: string,
};

interface Classes {
  button: string,
  iconAndTextSpan: string,
}

interface InjectSheetProps {
  classes: Classes,
  sheet: any
}

const positionStyle = {
  Left: {
    flexDirection: 'row',
    padding: '0 10px 0 0',
  },
  Right: {
    flexDirection: 'row-reverse',
    padding: '0 0 0 10px',
  },
};

const styles = {
  button: {
    paddingLeft: 0,
    padding: ({ iconPosition, text }: ButtonIconProps) => text ? positionStyle[iconPosition || 'Left'].padding : 0,
  },
  iconAndTextSpan: {
    display: 'flex',
    flexDirection: ({ iconPosition }: ButtonIconProps) => positionStyle[iconPosition || 'Left'].flexDirection,
    verticalAlign: 'top',
  },
};

class ButtonIconImp extends React.Component<InjectSheetProps & ButtonIconProps, {}> {

  static defaultProps = {
    iconColor: 'rgba(255, 255, 255, 0.6)',
  };

  renderIcon() {
    const { classes, iconClassName, symbolId, text, iconColor } = this.props;
    const size = this.getIconSize();
    const icon = (
      <Icon
        key="icon"
        className={iconClassName}
        symbolId={symbolId}
        color={iconColor}
        size={size}
      />
    );
    if (!text) return icon;
    const iconAndTextSpan = (
      <span
        key="text"
        className={classes.iconAndTextSpan}
      >
        {icon}
        {text}
      </span>
    );
    return [
      iconAndTextSpan,
    ];
  }

  getIconSize = () => {
    switch (this.props.btnSize) {
      case Size.XXXSMALL:
        return 16;
      case Size.XXSMALL:
        return 20;
      case Size.XSMALL:
        return 25;
      case Size.SMALL:
        return 30;
      case Size.BIG:
        return 42;
      default:
        return 34;
    }
  }

  render() {
    const {
      className: upperClassName,
      // filter out uncecessary props for Button
      classes,
      sheet,
      iconColor,
      symbolId,
      text,
      iconClassName,

      ...buttonProps
    } = this.props;

    return (
      <Button
        className={classNames(classes.button, upperClassName)}
        {...buttonProps}
      >
        {this.renderIcon()}
      </Button>
    );
  }
}

// force outer typing
export const ButtonIcon = injectSheet(styles)(ButtonIconImp) as unknown as React.ComponentType<ButtonIconProps>;
