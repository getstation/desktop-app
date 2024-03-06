import { GradientType, withGradient, ButtonIcon, IconSymbol, Style } from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import ClickOutside from 'react-click-outside';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
// @ts-ignore: no declaration file
import KeyHandler, { KEYDOWN } from 'react-key-handler';

const noop = () => {};

export interface Classes {
  container: string,
  panels: string,
  kbd: string,
  label: string,
  content: string,
  category: string,
  li: string,
  head: string,
  subtitle: string,
  titleText: string,
  closeButton: string,
}

type DefaultProps = {
  withClickOutside: boolean,
};

type HocProps = {
  themeGradient: string,
  classes?: Classes,
};

export type Props = HocProps & DefaultProps & {
  title?: string,
  onClose: (via: string) => void,
  children: React.ReactNode,
  contentClassName?: string,
  headClassName?: string,
};

const styles = () => ({
  container: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    top: 0,
    bottom: 0,
    left: 50,
    right: 0,
    overflow: 'auto',
    zIndex: 100,
    backgroundImage: (props: Props) => props.themeGradient,
    opacity: 1.00,
    color: 'white',
    borderLeft: '2px solid rgba(255, 255, 255, .4)',
    padding: '100px 40px 40px',
  },
  content: {
    flexGrow: 1,
    maxWidth: '1000px',
    alignSelf: 'center',
    '&>div': {
      display: 'inherit',
      width: '100%',
    },
  },
  head: {
    paddingBottom: '80px',
    fontSize: '14px',
    maxWidth: '1000px',
    width: '100%',
    display: 'flex',
    alignSelf: 'center',
  },
  titleText: {
    flexGrow: 1,
  },
  closeButton: {
    position: 'absolute !important',
    top: 40,
    left: 40,
  },
});

@injectSheet(styles)
class Overlay extends React.PureComponent<Props & HocProps> {

  static defaultProps: DefaultProps = {
    withClickOutside: true,
  };

  renderChildren() {
    const { onClose, children, withClickOutside } = this.props;
    const onClickOutside = withClickOutside ? () => onClose('click') : noop;
    return (
      <ClickOutside onClickOutside={onClickOutside}>
        {children}
      </ClickOutside>
    );
  }

  render() {
    const { classes, contentClassName, headClassName, title, onClose, withClickOutside } = this.props;

    return (
      <div className={classes!.container}>
        <KeyHandler
          keyEventName={KEYDOWN}
          keyValue="Escape"
          onKeyHandle={() => onClose('esc')}
        />
        <ButtonIcon
          onClick={withClickOutside ? noop : () => onClose('click')}
          symbolId={IconSymbol.CROSS}
          btnStyle={Style.SECONDARY}
          className={classes!.closeButton}
          type="button"
        />
        { title &&
        <div className={classNames(classes!.head, headClassName)}>
          <h1 className={classes!.titleText}>{title}</h1>
        </div>
        }
        <div className={classNames(classes!.content, contentClassName)}>
          {this.renderChildren()}
        </div>
      </div>
    );
  }
}

export default withGradient(GradientType.withOverlay)(Overlay);
