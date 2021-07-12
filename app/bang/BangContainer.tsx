import { ModalWrapper } from '@getstation/theme';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DockApplication from '../common/containers/DockApplication';
import NativeAppDockIcon, { IconSymbol, Size } from '../dock/components/NativeAppDockIcon';
import { SHORTCUTS } from '../keyboard-shortcuts';
import { StationState } from '../types';
import BangSubdock from './BangSubdock';
import { SearchPaneClosedVia, setVisibility, toggleVisibility } from './duck';
import { isVisible as getIsBangVisible } from './selectors';
import classNames = require('classnames');
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

interface Classes {
  bangIcon: string,
}

export interface OwnProps {
  classes?: Classes,
  onQuit: () => void,
}

export interface StateProps {
  isBangVisible: boolean,
}

export interface DispatchProps {
  hideBang: (via: SearchPaneClosedVia) => void,
  toggleBangVisibility: () => void,
}

export type Props = OwnProps & StateProps & DispatchProps;

@injectSheet(() => ({
  bangIcon: {
    opacity: .6,
  },
}))
class BangContainerImpl extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    this.hide = this.hide.bind(this);
  }

  hide(e: React.SyntheticEvent<HTMLElement>) {
    if (e.type === 'click') {
      this.props.hideBang('click-outside');
    } else if (e.type === 'keydown') {
      this.props.hideBang('topbar_menu_or_keyboard_shortcut');
    }
  }

  render() {
    const { classes, isBangVisible, toggleBangVisibility } = this.props;
    // remove the whitespace between ⌘ and T
    const kbd = SHORTCUTS.bang.kbd.replace(/\s/g, '');
    const toolTipText = `Quick switch  ${kbd}`;

    return (
      <DockApplication
        open={isBangVisible}
        onRequestClose={this.hide}
      >
        <NativeAppDockIcon
          className={classNames('appcues-bang-input', classes!.bangIcon)}
          iconSymbolId={IconSymbol.SEARCH}
          onClick={toggleBangVisibility}
          tooltip={isBangVisible ? undefined : toolTipText}
          size={Size.BIG}
        />
        <ModalWrapper onClickOutside={this.hide} backgroundOverlay={false}>
          <BangSubdock onQuit={this.props.onQuit} />
        </ModalWrapper>
      </DockApplication>
    );
  }
}

const BangContainer = connect<StateProps, DispatchProps>(
  (state: StationState) => ({
    isBangVisible: getIsBangVisible(state),
  }),
  dispatch => bindActionCreators(
    {
      toggleBangVisibility: () => toggleVisibility('center-modal', 'dedicated_button'),
      hideBang: (via: SearchPaneClosedVia) => setVisibility('center-modal', false, via),
    },
    dispatch
  )
)(BangContainerImpl);

export default BangContainer;
