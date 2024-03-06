import * as React from 'react';

export interface ITransparentTitleBarProps {
  onDoubleClick(event: any): void
}

export default class TransparentTitleBar extends React.PureComponent<ITransparentTitleBarProps, {}> {

  render() {
    return (
      <div
        className="title-bar-grab"
        onDoubleClick={this.props.onDoubleClick}
      />
    );
  }
}
