import { useEffect } from 'react';
import { connect } from 'react-redux';
import { isLoadingScreenVisible } from '../app/selectors';
import { isVisible as isOnboardingVisible } from '../onboarding/selectors';
import { getActiveApplicationId } from '../nav/selectors';
import { StationState } from '../types';

type LocationFragmentUpdaterProps = {
  appTotallyReady?: boolean,
  activeApplicationId?: string,
};

const LocationFragmentUpdater = ({ appTotallyReady, activeApplicationId }: LocationFragmentUpdaterProps) => {
  const updateFragment = () => {
    if (!appTotallyReady) {
      window.location.hash = '';
    } else {
      window.location.hash = `workspace${activeApplicationId ? `/application/${activeApplicationId}` : ''}`;
    }
  };

  // will update when props change
  useEffect(updateFragment, [appTotallyReady, activeApplicationId]);

  return null;
};

/**
 * Update the `window.location` fragment according to the state of the application:
 * - should contain `workspace` when the app is fully ready (no loading screen, no onboarding view..)
 * - should change whenever an application is focused on
 *
 * As of today, it's only used to have Appcues trigger flows only when the app
 * is ready and to trigger calls to  `Appcues.page()` (see `appcues.js`)
 * to encourage flow triggering.
 */
export default connect(
  (state: StationState) => ({
    // application is considered as totally ready when no loading screen and no onboarding
    appTotallyReady: !isLoadingScreenVisible(state) && !isOnboardingVisible(state),
    activeApplicationId: getActiveApplicationId(state),
  })
)(LocationFragmentUpdater);
