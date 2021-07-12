import * as React from 'react';
import NativeAppDockIcon, { IconSymbol } from '../../dock/components/NativeAppDockIcon';
import { osName } from '../../utils/process';

interface Props {
  onClick: () => void,
  isSnoozed: boolean,
  syncWithOS?: boolean,
}

export default class FocusModeDockIcon extends React.PureComponent<Props, {}> {
  render() {
    const { onClick, isSnoozed, syncWithOS } = this.props;

    const tooltipContent =
      syncWithOS ? `${osName} is in Do Not Disturb mode` :
      `${isSnoozed ? 'Enable' : 'Disable' } Notifications`;

    return (
      <NativeAppDockIcon
        className="appcues-subdock-focus"
        iconSymbolId={isSnoozed ? IconSymbol.BELL_OFF : IconSymbol.BELL}
        onClick={onClick}
        disabled={syncWithOS}
        tooltip={tooltipContent}
      />
    );
  }
}
