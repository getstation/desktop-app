import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface Props {
  into: string | HTMLElement,
}

export default class Portal extends React.PureComponent<Props, {}> {
  protected dest: HTMLElement | null;

  constructor(props: Props) {
    super(props);
    this.dest = null;
  }

  componentDidMount() {
    this.getDest();
    this.forceUpdate();
  }

  getDest() {
    if (this.dest === null) {
      if (typeof this.props.into === 'string') {
        this.dest = document.getElementById(this.props.into);
      } else {
        this.dest = this.props.into;
      }
    }
    return this.dest;
  }

  render() {
    const dest = this.getDest();
    if (dest === null) return null;

    return ReactDOM.createPortal(
      this.props.children,
      dest
    );
  }
}
