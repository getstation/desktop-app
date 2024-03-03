import { GradientType, withGradient } from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import DockApplication from './DockApplication';

interface Classes {
  subdockContainer: string,
}

interface OwnProps {
  classes?: Classes,
  themeGradient: string,
  className?: string,
  children: JSX.Element[],
  open: boolean,
  onRequestClose: (e?: React.SyntheticEvent<HTMLElement>) => void,
}

interface StateFromProps {
  themeGradient: string
}

interface JSSProps {
  classes?: any
}

type Props = JSSProps & StateFromProps & OwnProps;

@injectSheet({
  subdockContainer: {
    position: 'absolute',
    top: 0,
    left: 50,
    width: 280,
    height: '100%',
    color: 'white',
    zIndex: 2,
    borderLeft: '2px solid rgba(255,255,255,0.4)',
    backgroundImage: (props: Props) => props.themeGradient,
    '&>div': {
      height: '100%',
      width: '100%',
      overflow: 'auto',
    },
  },
})
class DockApplicationSubdockImpl extends React.PureComponent<Props, {}> {
  subdockContainer: HTMLDivElement | null;

  constructor(props: Props) {
    super(props);

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setSubdockContainerRef = this.setSubdockContainerRef.bind(this);
  }

  /**
    using Portal kinda disturbs ClickOutside.
    let's do some logic here to check that the click outside
    is definitely outside DockApplicationSubdock before calling onRequestClose
  **/
  handleClickOutside(e: React.SyntheticEvent<HTMLElement>) {
    if (!this.subdockContainer) return;
    const target = e.target as HTMLElement;
    if (!this.subdockContainer.contains(target)) this.props.onRequestClose(e);
  }

  setSubdockContainerRef(subdockContainer: HTMLDivElement | null) {
    this.subdockContainer = subdockContainer;
  }

  render() {
    const { classes, open, className, onRequestClose } = this.props;

    const childrenArray = React.Children.toArray(this.props.children);
    const [iconComponent, contentComponent] = childrenArray;

    return (
      <DockApplication open={open} onRequestClose={onRequestClose} onClickOutside={this.handleClickOutside}>
        {iconComponent}
        <div ref={this.setSubdockContainerRef} className={classNames(classes!.subdockContainer, className)}>
          {contentComponent}
        </div>
      </DockApplication>
    );
  }
}

export default withGradient(GradientType.withDarkOverlay)(DockApplicationSubdockImpl);
