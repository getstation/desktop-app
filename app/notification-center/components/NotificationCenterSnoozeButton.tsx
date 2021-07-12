import { Switcher, ButtonIcon, IconSymbol, Size, Style } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import ClickOutside from 'react-click-outside';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { Manager, Popper, Reference } from 'react-popper';
import { INFINITE, SYNC_WITH_OS } from '../constants';
import NotificationCenterSnoozePanel from './NotiticationCenterSnoozePanel';

export interface Classes {
  container: string,
  buttonContainer: string,
  buttonIconOverride: string,
  switcherWrapper: string
  inheritDisplay: string
  arrow: string,
}

export interface Props {
  classes?: Classes,
  currentSnoozeDurationInMs?: number | string,
  currentSnoozeStartedOn?: number,
  handleSnooze: (snoozeDuration: string) => void,
  handleResetSnooze: () => void,
}

export interface State {
  snoozePanelOpened: boolean,
}

const styles = () => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switcherWrapper: {
    marginRight: 2,
    transition: 'all 250ms ease-out',
    padding: 2,
    borderTopLeftRadius: '20px',
    borderBottomLeftRadius: '20px',
    backgroundColor: 'rgba(255,255,255, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255, 0.2)',
    },
  },
  // this is used so that the divs added by popper don't screw things
  inheritDisplay: {
    display: 'inherit',
  },
  buttonIconOverride: {
    height: 25,
    borderRadius: 0,
    borderTopRightRadius: '20px',
    borderBottomRightRadius: '20px',
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderBottom: '5px solid white',
  },
});

@injectSheet(styles)
class NotificationCenterSnoozeButton extends React.PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      snoozePanelOpened: false,
    };

    this.closeSnoozePanel = this.closeSnoozePanel.bind(this);
    this.toggleSnoozePanel = this.toggleSnoozePanel.bind(this);
    this.handleSwitcherChange = this.handleSwitcherChange.bind(this);
    this.handleSnooze = this.handleSnooze.bind(this);
  }

  closeSnoozePanel() {
    this.setState({ snoozePanelOpened: false });
  }

  toggleSnoozePanel() {
    this.setState({ snoozePanelOpened: !this.state.snoozePanelOpened });
  }

  handleSwitcherChange() {
    if (this.isSnoozed()) {
      this.props.handleResetSnooze();
    } else {
      this.props.handleSnooze(INFINITE);
    }
  }

  isSnoozed() {
    const { currentSnoozeDurationInMs } = this.props;
    if (!currentSnoozeDurationInMs) return false;
    return currentSnoozeDurationInMs > 0 || currentSnoozeDurationInMs === SYNC_WITH_OS || currentSnoozeDurationInMs === INFINITE;
  }

  handleSnooze(duration: string) {
    this.props.handleSnooze(duration);
    this.closeSnoozePanel();
  }

  render() {
    const { classes } = this.props;

    return (
      <ClickOutside onClickOutside={this.closeSnoozePanel}>
        <div className={classes!.buttonContainer}>
          <span className={classes!.switcherWrapper}>
            <Switcher
              checked={this.isSnoozed()}
              onChange={this.handleSwitcherChange}
            />
          </span>
          <div className={classes!.inheritDisplay}>
            <Manager>
              <Reference>
                {({ ref }) => (
                  <div className={classes!.inheritDisplay} ref={ref}>
                    <ButtonIcon
                      className={classes!.buttonIconOverride}
                      symbolId={IconSymbol.TIME}
                      btnStyle={Style.SECONDARY}
                      onClick={this.toggleSnoozePanel}
                      btnSize={Size.XSMALL}
                    />
                  </div>
                )}
              </Reference>
              {this.state.snoozePanelOpened &&
                <div style={{ zIndex: 1 }}>
                  <Popper>
                    {({ ref, style, placement, arrowProps }) => (
                      <div ref={ref} style={style} data-placement={placement}>
                        <NotificationCenterSnoozePanel handleSnooze={this.handleSnooze} />
                        <div className={classes!.arrow} {...arrowProps} />
                      </div>
                    )}
                  </Popper>
                </div>
              }
            </Manager>
          </div>
        </div>
      </ClickOutside>
    );
  }
}

export default NotificationCenterSnoozeButton;
