import * as React from 'react';
// @ts-ignore: no declaration file
import KeyHandler, { KEYDOWN, KEYUP } from 'react-key-handler';

export interface ChildrenFunctionArg0 {
  /**
   * `true` if user currently holding, otherwise `false`.
   */
  isHoldingKey: boolean,
}

export interface Props {
  keyValue: string,
  children: (props: ChildrenFunctionArg0) => React.ReactNode;
}

interface State {
  isHoldingKey: boolean,
}

/**
 * A React component that notifies its children that a particlar key
 * is hold.
 */
export default class KeyHold extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isHoldingKey: false,
    };
  }

  handleKeyDown = () => {
    this.setState({ isHoldingKey: true });
  }

  handleKeyUp = () => {
    this.setState({ isHoldingKey: false });
  }

  render() {
    return (
      <>
        <KeyHandler
          keyEventName={KEYDOWN}
          keyValue={this.props.keyValue}
          onKeyHandle={this.handleKeyDown}
        />
        <KeyHandler
          keyEventName={KEYUP}
          keyValue={this.props.keyValue}
          onKeyHandle={this.handleKeyUp}
        />
        {
          this.props.children(this.state)
        }
      </>
    );
  }
}
