//import { remote } from 'electron';
import { getCurrentWindow as remoteGetCurrentWindow } from '@electron/remote';
import * as React from 'react';
import TrafficLights from './TrafficLights';

interface Props {
  onClose: () => any,
}

interface State {
  focused: boolean
}

export default class TrafficLightsContainer extends React.PureComponent<Props, State> {

  public win: Electron.BrowserWindow;

  constructor(props: Props) {
    super(props);

    this.win = remoteGetCurrentWindow();

    this.state = {
      focused: this.win.isFocused(),
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleMinimize = this.handleMinimize.bind(this);
    this.handleExpand = this.handleExpand.bind(this);
  }

  onFocus() {}

  onBlur() {}

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
