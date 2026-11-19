import * as React from 'react';
import injectSheet from 'react-jss';
import { createStyles, ThemeTypes } from '../../types';
import classNames = require('classnames');
import { Icon, IconSymbol } from '../Icon';

export enum Size {
  BIG, NORMAL, SMALL, XSMALL, XXSMALL, XXXSMALL,
}
export enum Style {
  MAIN, PRIMARY, SECONDARY, TERTIARY, LINK, DANGER, OUTLINED,
}

export interface ButtonOwnProps extends JSX.IntrinsicClassAttributes<ButtonImpl> {
  btnSize?: Size,
  btnStyle?: Style
  isLoading?: boolean,
}
interface InjectSheetProps {
  classes: any,
  sheet: any,
}

// outer props
export type ButtonProps = ButtonOwnProps & React.HTMLProps<HTMLButtonElement>;

const styles = (theme: ThemeTypes) => createStyles({
  button: {
    position: 'relative',
    appearance: 'none' as 'none',
    border: 'none',
    padding: ((props: ButtonProps) => isRenderingIcon(props) ? 0 : '0 20px') as any,
    borderRadius: '34px',
    height: '34px',
    lineHeight: '34px',
    fontSize: '11px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 250ms ease-out',
    '&:disabled': {
      cursor: 'default',
      opacity: 0.4,
    },
    '&:focus': {
      outline: 'none',
    },
  },
  buttonXSmall: {
    height: '24px',
    lineHeight: '24px',
  },
  buttonXXSmall: {
    height: '20px',
    lineHeight: '20px',
    padding: '0 10px',
  },
  buttonXXXSmall: {
    height: '16px',
    lineHeight: '16px',
    padding: '0 10px',
  },
  buttonSmall: {
    height: '30px',
    lineHeight: '30px',
  },
  buttonBig: {
    fontSize: '13px',
    height: '42px',
    lineHeight: '42px',
  },
  buttonMain: {
    backgroundColor: '#3070CD',
    color: '#fff',
    '&:hover:enabled, &:active:enabled': {
      backgroundColor: 'rgb(49, 101, 177)',
    },
  },
  buttonPrimary: {
    backgroundColor: '#292929',
    color: '#fff',
    '&:hover:enabled, &:active:enabled': {
      filter: 'brightness(140%)',
    },
  },
  buttonSecondary: {
    color: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(255,255,255, 0.1)',
    '&:hover:enabled, &:active:enabled': {
      backgroundColor: 'rgba(255,255,255, 0.2)',
    },
  },
  buttonTertiary: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    color: 'rgba(0, 0, 0, 0.4)',
    '&:hover:enabled, &:active:enabled': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
  },
  buttonLink: {
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'transparent',
    textDecoration: 'underline',
    '&:hover:enabled, &:active:enabled': {
      color: 'rgba(255, 255, 255, 0.8)',
    },
  },
  buttonDanger: {
    backgroundColor: theme.colors.flatRed.middle,
    color: 'white',
    '&:hover:enabled, &:active:enabled': {
      backgroundColor: theme.colors.flatRed.dark,
    },
  },
  outlined: {
    color: '#3070CD',
    border: 'solid 1px #3070CD',
  },
  content: {
    opacity: (({ isLoading } : ButtonProps) => isLoading ? 0 : 1) as any,
    transition: '300ms',
  },
  '@keyframes spin': {
    '100%': { transform: 'rotate(360deg)' },
  },
  loading: {
    ...theme.mixins.flexbox.containerCenter,
    position: 'absolute',
    left: 0,
    ...theme.mixins.size('100%'),
    opacity: (({ isLoading } : ButtonProps) => isLoading ? 1 : 0) as any,
    transition: 'opacity 300ms',
    '& svg': {
      animation: `spin 1.5s cubic-bezier(0.82, 0.26, 0.25, 0.68) infinite`,
      animationPlayState: (({ isLoading } : ButtonProps) => isLoading ? 'running' : 'paused') as any,
    },
  },
});
export class ButtonImpl extends React.Component<ButtonProps & InjectSheetProps, {}> {

  public static defaultProps: Partial<ButtonProps> = {
    btnSize: Size.NORMAL,
    btnStyle: Style.PRIMARY,
  };

  render() {
    const { classes, className: upperClassName, btnSize, btnStyle, sheet: _, ...buttonProps } = this.props;

    const sizeClassNames = {
      [Size.XXXSMALL]: classes.buttonXXXSmall,
      [Size.XXSMALL]: classes.buttonXXSmall,
      [Size.XSMALL]: classes.buttonXSmall,
      [Size.SMALL]: classes.buttonSmall,
      [Size.NORMAL]: '',
      [Size.BIG]: classes.buttonBig,
    };

    const styleClassNames = {
      [Style.MAIN]: classes.buttonMain,
      [Style.PRIMARY]: classes.buttonPrimary,
      [Style.SECONDARY]: classes.buttonSecondary,
      [Style.TERTIARY]: classes.buttonTertiary,
      [Style.LINK]: classes.buttonLink,
      [Style.DANGER]: classes.buttonDanger,
      [Style.OUTLINED]: classes.outlined,
    };

    const className = classNames(
      classes.button,
      sizeClassNames[btnSize!],
      styleClassNames[btnStyle!],
      upperClassName
    );

    return (
      <button
        className={className}
        {...(buttonProps as any)}
      >
        <div className={classes.loading}>
          <Icon symbolId={IconSymbol.LOADING} size={15} color={'#fff'}/>
        </div>

        <span className={classes!.content}>{this.props.children}</span>
      </button>
    );
  }
}

// Helpers
const isRenderingIcon = (props: ButtonProps): boolean => {
  const childrenIsObject = typeof props.children === 'object';
  if (!childrenIsObject) return false;
  const childrenHasProps = typeof (props.children as React.ReactElement<typeof props.children>).props !== 'undefined';
  if (!childrenHasProps) return false;
  return Object.keys((props.children as React.ReactElement<typeof props.children>).props!)
    .some((prop: string) => prop === 'symbolId');
};

// force outer typing
export const Button = injectSheet(styles)(ButtonImpl) as unknown as React.ComponentType<ButtonProps>;
