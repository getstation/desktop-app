import PopperJS from 'popper.js';
import * as React from 'react';
// @ts-ignore: no declaration file
import ReactHoverObserver from 'react-hover-observer';
import injectSheet, { WithSheet } from 'react-jss';
import { Manager, Popper, Reference } from 'react-popper';
import classNames = require('classnames');

interface OwnProps {
  className?: string;
  tooltip?: string;
  placement?: PopperJS.Placement;
  offset?: string;
  hintClassname?: string;
  alternate?: boolean;
  themeGradient?: string;
}

interface State {
  isHovering: boolean;
  tooltipShown: boolean;
}

const styles = {
  hint: {
    width: 137,
    margin: [0, 0, 0, 2] as any,
    padding: [5, 10, 6] as any,
    fontSize: 11,
    fontWeight: 700,
    textAlign: 'center' as 'center',
    color: '#FFF',
    backgroundColor: '#333',
    borderRadius: 2,
  },
  alternate: {
    borderRadius: 12,
    backgroundImage: ((props: OwnProps) => props.themeGradient || 'initial') as any,
  },
};

type Props = OwnProps & WithSheet<typeof styles, {}>;

class TooltipImpl extends React.PureComponent<Props, State> {
  static defaultProps = {
    placement: 'right' as PopperJS.Placement,
    offset: '0, 2',
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      isHovering: false,
      tooltipShown: false,
    };
    this.handleHoverChanged = this.handleHoverChanged.bind(this);
  }

  componentWillReceiveProps(nextProps: Props) {
    const tooltipShown = Boolean(nextProps.tooltip && !this.props.tooltip);

    if (tooltipShown) {
      this.setState({ tooltipShown: true });
      return;
    }

    if (!tooltipShown && !this.state.isHovering) {
      this.setState({ tooltipShown: false });
      return;
    }
  }

  handleHoverChanged({ isHovering }: { isHovering: boolean }) {
    this.setState({ isHovering });

    if (!isHovering && this.state.tooltipShown) {
      this.setState({ isHovering: false, tooltipShown: false });
    }
  }

  render() {
    const { children, tooltip, placement, classes, offset, hintClassname, alternate } = this.props;

    return (
      <div className={this.props.className}>
        <Manager>
          <Reference>
            {({ ref }) => (
              <div ref={ref}>
                <ReactHoverObserver
                  hoverDelayInMs={500}
                  onHoverChanged={this.handleHoverChanged}
                  shouldDecorateChildren={false}
                >
                  {children}
                </ReactHoverObserver>
              </div>
            )}
          </Reference>
          {!this.state.tooltipShown &&
            tooltip &&
            this.state.isHovering && (
              <Popper
                placement={placement}
                modifiers={{
                  preventOverflow: { enabled: true, boundariesElement: 'viewport' },
                  offset: { offset },
                }}
                positionFixed={true}
              >
                {({ ref, style, placement: givenPlacement }) => (
                  <div
                    ref={ref}
                    style={style}
                    data-placement={givenPlacement}
                    className={classNames(classes.hint, hintClassname, { [classes.alternate]: alternate })}
                  >
                    {tooltip}
                  </div>
                )}

              </Popper>
            )}
        </Manager>
      </div>
    );
  }
}

export const Tooltip = injectSheet(styles)(TooltipImpl);
