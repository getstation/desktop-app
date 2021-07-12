import { Button, Size, Style } from '@getstation/theme';
import * as React from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAppStoreTab } from '../../../app-store/selectors';
import { dispatchUrl, navigateToApplicationTab } from '../../../applications/duck';
import { StationState } from '../../../types';

type StateProps = {
  appStoreTab: any,
};

type DispatchProps = {
  dispatchUrl: (url: string, origin: { tabId: string }) => void,
  navigateToApplicationTab: (appliactionId: string, tabId: string) => void,
};

type MergeProps = {
  navigateToBoostedApps: () => void,
};

export type OwnProps = {
  closeSettings: (via: 'navigate-to-appstore') => void,
};
type Props = OwnProps & MergeProps;

const FindBoostedAppsButton = ({ navigateToBoostedApps, closeSettings }: Props) => {
  const onClick = React.useCallback(() => {
    closeSettings('navigate-to-appstore');
    navigateToBoostedApps();
  }, [navigateToBoostedApps, closeSettings]);

  return (
    <Button btnSize={Size.XSMALL} btnStyle={Style.SECONDARY} onClick={onClick}>
      Find boosted apps
    </Button>
  );
};

const connector = compose(
  connect<StateProps, DispatchProps, MergeProps>(
    (state: StationState) => ({
      appStoreTab: getAppStoreTab(state),
    }),
    dispatch => bindActionCreators({
      dispatchUrl,
      navigateToApplicationTab,
    }, dispatch),
    (stateProps, dispatchProps, ownProps) => ({
      ...ownProps,
      navigateToBoostedApps: () => {
        if (stateProps.appStoreTab) {
          const tab = stateProps.appStoreTab;

          const tabId = tab.get('tabId');

          const url = new URL(tab.get('url'));
          url.hash = '#boosted-apps';

          dispatchProps.dispatchUrl(url.toString(), { tabId });
        }
      },
    })
  ),
);
const ConnectedFindBoostedAppsButton = connector(FindBoostedAppsButton) as React.ComponentType<OwnProps>;

export default ConnectedFindBoostedAppsButton;
