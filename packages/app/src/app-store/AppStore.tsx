import * as React from 'react';
// @ts-ignore: no declaration file
import KeyHandler, { KEYDOWN } from 'react-key-handler';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NativeAppDockIcon, { IconSymbol } from '../dock/components/NativeAppDockIcon';
import { disableApplicationStoreTooltip } from '../onboarding/duck';
import { isApplicationStoreTooltipDisabled } from '../onboarding/selectors';
import { StationState } from '../types';
import { toggleVisibility } from './duck';
import { getAppStoreApplication, getAppStoreTab, isVisible } from './selectors';

interface IProps {
  application: any,
  tab: any,
  isPaneVisible: any,
  isTooltipDisabled: boolean,
  onClickDockIcon: () => void,
  onEscapeKeyDown: () => void,
  disableApplicationStoreTooltip: () => void,
}

class AppStoreImpl extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
    this.onClickDockIcon = this.onClickDockIcon.bind(this);
  }

  onClickDockIcon() {
    if (!this.props.isTooltipDisabled) {
      this.props.disableApplicationStoreTooltip();
    }
    this.props.onClickDockIcon();
  }

  render() {
    const {
      isPaneVisible,
      isTooltipDisabled,
      onEscapeKeyDown,
      application,
    } = this.props;
    const badgeIsActive = !isTooltipDisabled;

    if (!application) return null;

    return (
      <div>
        <NativeAppDockIcon
          className="appcues-subdock-appstore"
          iconSymbolId={IconSymbol.PLUS}
          active={isPaneVisible}
          onClick={this.onClickDockIcon}
          badge={badgeIsActive}
          tooltip={'Add apps and extensions'}
        />

        { isPaneVisible &&
          <KeyHandler
            keyEventName={KEYDOWN}
            keyValue="Escape"
            onKeyHandle={onEscapeKeyDown}
          />
        }
      </div>
    );
  }
}

const AppStore = connect(
  (state: StationState) => ({
    application: getAppStoreApplication(state),
    tab: getAppStoreTab(state),
    isPaneVisible: isVisible(state),
    isTooltipDisabled: isApplicationStoreTooltipDisabled(state),
  }),
  dispatch => bindActionCreators(
    {
      disableApplicationStoreTooltip: disableApplicationStoreTooltip,
      onClickDockIcon: toggleVisibility,
      onEscapeKeyDown: toggleVisibility,
    },
    dispatch
  )
)(AppStoreImpl);

export default AppStore;
