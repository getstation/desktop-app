import { Icon, IconSymbol, Tooltip } from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import * as shortid from 'shortid';
export import IconSymbol = IconSymbol;

export enum Size {
  HALF, NORMAL, BIG,
}

interface Classes {
  dockIcon: string,
  sizeHalf: string,
  sizeBig: string,
  defaultInner: string,
  defaultShape: string,
  activeInner: string,
  disabled: string,
}

interface Props {
  classes?: Classes,
  className?: string,
  iconSymbolId: IconSymbol,
  imageURL?: string,
  fallbackImageURL?: string,
  onClick?: () => any,
  onMouseEnter?: () => any,
  onMouseLeave?: () => any,
  active?: boolean,
  badge?: boolean
  color?: string,
  disabled?: boolean,
  tooltip?: string,
  size?: Size,
}

interface State {
  canRenderImage: boolean,
}

@injectSheet({
  dockIcon: {
    display: 'block',
    margin: [2, 0],
    '&:not($disabled):hover': {
      '& $defaultInner': { fillOpacity: 0.2 },
      '& $defaultShape': { fillOpacity: 1 },
      '& $activeInner': {
        animationName: 'none',
        fillOpacity: 0.9,
      },
    },
  },
  sizeHalf: {
    margin: 0,
  },
  sizeBig: {
    margin: [4, 0],
  },
  disabled: {
    opacity: .2,
  },
  defaultInner: {
    fill: '#fff',
    fillOpacity: 0,
    transition: 'all 250ms ease-out',
  },
  activeInner: {
    fill: '#fff',
    transition: 'all 250ms ease-out',
  },
  defaultShape: {
    fill: '#fff',
    fillOpacity: 0.6,
    transition: 'all 250ms ease-out',
  },
})
export default class NativeAppDockIcon extends React.PureComponent<Props, State> {

  static defaultProps = {
    size: Size.NORMAL,
    active: false,
    badge: false,
    onClick: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
  };

  maskId: string;
  imageId: string;
  img: SVGImageElement | null;

  constructor(props: Props) {
    super(props);
    this.state = {
      canRenderImage: true,
    };

    this.maskId = `icon-mask-${shortid.generate()}`;
    this.imageId = `icon-img-${shortid.generate()}`;
  }

  componentDidMount() {
    if (this.img) {
      (this.img as any).onerror = () => {
        if (this.state.canRenderImage) {
          this.setState({ canRenderImage: false });
        }
      };
    }
  }

  renderImg() {
    const { classes, active } = this.props;
    return (
      <g>
        { active &&
          <rect width="42" height="24" x="4" y="0" rx="2" className={classes!.activeInner} />
        }
        <circle cx="25" cy="12" r="9" fill="#fff" className={classes!.defaultShape} />
        <circle cx="25" cy="12" r="8" fill={`url(#${this.imageId})`} />
      </g>
    );
  }

  renderIcon() {
    const { classes, active, iconSymbolId, color, size } = this.props;

    const sizeProps = {
      [Size.NORMAL]: {
        width: 42, height: 24, x: 4, y: 0, rx: 2,
      },
      [Size.BIG]: {
        width: 36, height: 32, x: 0, y: 0, rx: 2,
      },
    };

    // if active we display a masked icon
    if (active) {
      return (
        <g fill="none" fillRule="evenodd" mask={`url(#${this.maskId})`}>
          <rect {...sizeProps[size!]} className={classes!.activeInner} />
        </g>
      );
    }

    return (
      <g className={classes!.defaultShape}>
        <Icon symbolId={iconSymbolId} color={color} />
      </g>
    );
  }

  renderBadge() {
    const { badge, iconSymbolId } = this.props;

    if (!badge) return null;

    // coords of the badge
    let coords = { x: 34, y: 5 };

    // for notificaton icon, for easthetism we'd like to place
    // the badge exactly on the dot of the icon
    if (iconSymbolId === IconSymbol.NOTIFICATION) {
      coords = { ...coords, x: 28 };
    }

    return (
      <rect width="4" height="4" {...coords} fill="#EF5757" rx="2" />
    );
  }

  renderSvg() {
    const {
      classes, onMouseEnter, onMouseLeave, iconSymbolId, active, disabled, onClick, imageURL,
      fallbackImageURL, size,
    } = this.props;
    const { canRenderImage } = this.state;

    const sizeClassNames = {
      [Size.HALF]: classes!.sizeHalf,
      [Size.NORMAL]: '',
      [Size.BIG]: classes!.sizeBig,
    };

    const className = classNames(
      classes!.dockIcon,
      sizeClassNames[size!],
      { [classes!.disabled]: disabled }
    );

    const SizesProps = {
      [Size.HALF]: {
        width: 25, height: 24, viewBox: '0 0 25 24', x: 0, y: 0, rx: 2, rectWidth: 25,
      },
      [Size.NORMAL]: {
        width: 50, height: 24, viewBox: '0 0 50 24', x: 4, y: 0, rx: 2, rectWidth: 42,
      },
      [Size.BIG]: {
        width: 50, height: 32, viewBox: '0 0 50 32', x: 4, y: 0, rx: 2, rectWidth: 42,
      },
    };

    const props = SizesProps[size!];

    return (
      <svg
        width={props.width}
        height={props.height}
        viewBox={props.viewBox}
        className={className}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <defs>
          <mask id={this.maskId}>
            <rect width="100%" height="100%" fill="#ffffff" />
            <g>
              <Icon symbolId={iconSymbolId} size={24} color="#000" />
            </g>
          </mask>

          { imageURL &&
            <pattern id={this.imageId} width="100%" height="100%" x="0">
              <image ref={img => this.img = img} xlinkHref={canRenderImage ? imageURL : fallbackImageURL} width="16" height="16" />
            </pattern>
          }
        </defs>

        <g>
          { !active &&
            <rect className={classes!.defaultInner} width={props.rectWidth} height={props.height} x={props.x} y={props.y} rx={props.rx} />
          }
          {imageURL ? this.renderImg() : this.renderIcon()}
          {this.renderBadge()}
        </g>
      </svg>
    );
  }

  render() {
    const { tooltip } = this.props;

    return (
      <Tooltip className={this.props.className} placement="right" tooltip={tooltip}>
        {this.renderSvg()}
      </Tooltip>
    );
  }
}
