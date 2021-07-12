import * as memoize from 'memoizee';
import { createSelector } from 'reselect';
import { getApplicationId } from '../applications/get';
import { getApplicationsWithManifest } from '../applications/selectors';
import { ApplicationImmutable } from '../applications/types';
import { getActiveApplicationId } from '../nav/selectors';
import { StationState } from '../types';

const APP_STORE_MANIFEST_URL = process.env.APP_STORE_MANIFEST_URL!;

export const getState = (state: StationState) => state.get('appStore');

export const getAppStoreApplication = memoize((state: StationState): any =>
  state.get('applications').find((app: any) => app.get('manifestURL') === APP_STORE_MANIFEST_URL));

export const getAppStoreTab = memoize((state: StationState) => {
  const appStoreApplication = getAppStoreApplication(state);
  if (!appStoreApplication) return;
  return state.get('tabs')
    .find((t: any) =>
      (t.get('applicationId') === appStoreApplication.get('applicationId')) && t.get('isApplicationHome')
    );
});

export const isVisible = createSelector(
  getAppStoreApplication,
  getActiveApplicationId,
  (application?: ApplicationImmutable, applicationId?: string) => {
    if (!application || !applicationId) return false;
    return getApplicationId(application) === applicationId;
  }
);

/**
 * Will select true if we already have applications that have the given manifesURL.
 */
export const hasAlreadyApplicationsForManifest = (state: StationState, manifestURL: string) =>
  getApplicationsWithManifest(state, manifestURL).size > 0;
