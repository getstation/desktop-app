import * as React from 'react';

interface Props {
  callback: () => any,
  enabled?: boolean,
  timeout?: number,
}

export default class ReactInterval extends React.PureComponent<Props, {}> {
  static defaultProps = {
    enabled: false,
    timeout: 1000,
  };

  timer: any;

  constructor(props: Props) {
    super(props);

    this.callback = this.callback.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  componentDidMount() {
    if (this.props.enabled) {
      this.start();
    }
  }

  shouldComponentUpdate({ timeout, callback, enabled } : Props) {
    return (
      this.props.timeout !== timeout ||
      this.props.callback !== callback ||
      this.props.enabled !== enabled
    );
  }

  componentDidUpdate({ enabled } : Props) {
    if (this.props.enabled !== enabled) {
      if (this.props.enabled) {
        this.start();
      } else {
        this.stop();
      }
    }
  }

  componentWillUnmount() {
    this.stop();
  }

  callback() {
    if (this.timer) {
      this.props.callback();
      this.start();
    }
  }

  start() {
    this.stop();
    this.timer = setTimeout(this.callback, this.props.timeout);
  }

  stop() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  render() {
    return null;
  }
}
