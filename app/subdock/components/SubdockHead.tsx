import { IconSymbol } from '@getstation/theme';
import * as React from 'react';
import { oc } from 'ts-optchain';

import {
  GetApplicationStateQuery,
} from '../../applications/queries@local.gql.generated';

import SubdockButton from './SubdockButton';

interface OwnProps {
  application: GetApplicationStateQuery['application'],
  notificationsEnabled: boolean | undefined, // TODO: Move this in Notifications resolver
  openApplicationPreferences: (application: GetApplicationStateQuery['application']) => void,
  toggleNotifications: () => void,
}

type Props = OwnProps;

class SubdockHead extends React.PureComponent<Props, {}> {
  getApplicationDescription = (): string => {
    const { application } = this.props;

    if (application.fullDomain) return application.fullDomain;

    if (application.passwordManagerLogin) return application.fullDomain || '';

    return oc(application).identity.profileData.email() || '';
  }

  handleOpenPreferences = () => {
    const { openApplicationPreferences, application } = this.props;
    openApplicationPreferences(application);
  }

  render() {
    const {
      application,
      notificationsEnabled,
      toggleNotifications,
    } = this.props;

    return (
      <div className="l-subdock__head">
        <div className="l-subdock__titles">

          <strong>{application.manifestData.name}</strong>

          {application && this.getApplicationDescription() &&
          <small>{this.getApplicationDescription()}</small>
          }
        </div>

        <div className="l-subdock__actions">
          <SubdockButton
            tooltip={notificationsEnabled === false ? 'Enable notifications' : 'Disable notifications'}
            size={24}
            // an explicit comparaison notificationsEnabled is enabled by default === undefined
            symbolId={notificationsEnabled === false ? IconSymbol.BELL_OFF : IconSymbol.BELL}
            onClick={toggleNotifications}
          />
          <SubdockButton
            tooltip="Open Settings"
            size={24}
            symbolId={IconSymbol.COG}
            onClick={this.handleOpenPreferences}
          />
        </div>
      </div>
    );
  }
}

export default SubdockHead;
