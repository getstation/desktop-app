import * as remote from '@electron/remote';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
// @ts-ignore
import { toggleFullScreen } from '../../app/duck';
import TrafficLights from './TrafficLights';

interface DispatchProps {
  onToggleFullScreen: () => void;
}

interface OwnProps {
  onClose: () => any,
}

interface State {
  focused: boolean
}

class TrafficLightsContainer extends React.PureComponent<any, State> {

  public win: Electron.BrowserWindow;

  constructor(props: any) {
    super(props);

    this.win = remote.getCurrentWindow();

    this.state = {
      focused: this.win.isFocused(),
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleMinimize = this.handleMinimize.bind(this);
    this.handleExpand = this.handleExpand.bind(this);
  }

  onFocus() { }

  onBlur() { }

  componentDidMount() {
    this.onFocus = () => {
      this.setState({ focused: true });
    };

    this.onBlur = () => {
      this.setState({ focused: false });
    };

    this.win.on('focus', this.onFocus);
    this.win.on('blur', this.onBlur);
  }

  componentWillUnmount() {
    this.win.removeListener('focus', this.onFocus);
    this.win.removeListener('blur', this.onBlur);
  }

  handleClose() {
    return this.props.onClose();
  }

  handleMinimize() {
    return this.win.minimize();
  }

  handleExpand() {
    this.win.focus();
    this.win.setFullScreen(!this.win.isFullScreen());
  }

  render() {
    return (
      <TrafficLights
        focused={this.state.focused}
        handleClose={this.handleClose}
        handleMinimize={this.handleMinimize}
        handleExpand={this.handleExpand}
      />
    );
  }
}

export default connect<{}, DispatchProps, OwnProps>(
  null,
  (dispatch: Dispatch) => bindActionCreators({
    onToggleFullScreen: toggleFullScreen,
  }, dispatch)
)(TrafficLightsContainer);
