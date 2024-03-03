import * as React from 'react';
// @ts-ignore: no declaration file
import ClickOutside from 'react-click-outside';
// @ts-ignore: no declaration file
import KeyHandler, { KEYDOWN } from 'react-key-handler';
import Portal from './Portal';

interface Props {
  children: React.ReactNode,
  open: boolean,
  onRequestClose: (e?: React.SyntheticEvent<HTMLElement>) => void,
  onClickOutside?: (e: React.SyntheticEvent<HTMLElement>) => void,
}

export default class DockApplication extends React.PureComponent<Props, {}> {
  subdockContainer: HTMLDivElement | null;

  render() {
    const { onClickOutside, onRequestClose } = this.props;

    const childrenArray = React.Children.toArray(this.props.children);
    const [iconComponent, contentComponent] = childrenArray;

    return (
      <ClickOutside onClickOutside={onClickOutside || (() => null)}>
        {iconComponent}

        <Portal into="portal-application-scene">
            { this.props.open &&
              contentComponent
            }
        </Portal>

        { this.props.open &&
          <KeyHandler
            keyEventName={KEYDOWN}
            keyValue="Escape"
            onKeyHandle={onRequestClose}
          />
        }
      </ClickOutside>
    );
  }
}
