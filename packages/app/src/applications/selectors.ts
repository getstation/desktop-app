import * as Immutable from 'immutable';
// @ts-ignore: no declaration file
import * as isBlank from 'is-blank';
import * as memoize from 'memoizee';
import { uniq } from 'ramda';
import { createSelector } from 'reselect';
import { getActiveApplicationId } from '../nav/selectors';
import { getSnoozeDuration } from '../notification-center/selectors';
import { hasSubwindowsTabId } from '../subwindows/get';
import { getSubwindows } from '../subwindows/selectors';

import {
  getTabWebcontents,
  getWebcontentsCrashed,
  getWebcontentsErrorCode,
  getWebcontentsErrorDescription,
  getWebcontentsId,
  getWebcontentsMountState,
  isWebcontentsDetaching,
  isWebcontentsWaitingToAttach,
} from '../tab-webcontents/selectors';
import { getTabApplicationId, getTabBadge, getTabId, getTabIsApplicationHome, hasTabApplicationId } from '../tabs/get';
import { StationState } from '../types';
import { getEmail } from '../user-identities/get';
import { getIdentitiesForProvider, getIdentityById } from '../user-identities/selectors';
import { ApplicationConfigData } from './duck';
import {
  getApplicationActiveTab,
  getApplicationIdentityId,
  getApplicationManifestURL,
  getApplicationSubdomain,
  getConfigData,
  getInstallContext,
  getApplicationId,
} from './get';
import { ApplicationImmutable, ApplicationsImmutable } from './types';
import { INTERNAL_APPLICATIONS } from './manifest-provider/const';
import { StationUserIdentityImmutable } from '../user-identities/types';

export const getApplicationsByManifestURL = (
  state: StationState,
  manifestURL: string,
): ApplicationsImmutable =>
  getApplications(state)
    .filter((application) => application.get('manifestURL') === manifestURL);

export const getApplicationsByManifestURLs = (
  state: StationState,
  manifestURLs: string[],
): ApplicationsImmutable =>
  getApplications(state)
    .filter((application) => manifestURLs.includes(application.get('manifestURL')));

const getTabs = (state: StationState) => state.get('tabs');

export const getApplications = (state: StationState) => state.get('applications');

export const getApplicationsWithoutInternals = createSelector(
  getApplications, applications =>
    applications
      .filter(app => !INTERNAL_APPLICATIONS
        .includes(getApplicationManifestURL(app))
      )
);

export const getInstalledManifestURLs = createSelector(getApplications, applications => {
  const manifests = applications.toArray()
    .map(getApplicationManifestURL)
    .filter((manifestURL?: string) => !isBlank(manifestURL));
  return uniq(manifests);
});

export const getInstalledApplicationsIdsAsSetWithoutNonInstallables = createSelector(
  getApplications,
  applications => applications
    .map(application => getInstallContext(application))
    .filter(Boolean)
    .map((ctx: any) => ctx.get('id'))
    .toSet()
);

export const getActiveApplication = (state: StationState) =>
  getApplicationById(state, getActiveApplicationId(state)!);

export const getApplicationById = (state: StationState, applicationId: string) =>
  getApplications(state).get(applicationId);

export const getApplicationsWithNotificationsEnabled = (state: StationState) =>
  getApplications(state).filter(app => app.get('notificationsEnabled', false));

const badgeReducer = (totalBadge: number, badge: number) => {
  if (!badge) return totalBadge;
  if (!totalBadge) return badge;

  if (Number.isInteger(totalBadge) && Number.isInteger(badge)) {
    return totalBadge + badge;
  }
  // can't be added
  return '•';
};

const capBadge = (badge: any) => {
  if (!badge || !Number.isInteger(badge)) return badge;
  return badge > 99 ? '99+' : badge;
};

export const getBadgeForApplication = createSelector(getTabs, tabs => memoize((appId: string) => {
  const badge =
    tabs
      .filter(tab => getTabApplicationId(tab) === appId)
      .filter(tab => Boolean(getTabBadge(tab)))
      .map(tab => getTabBadge(tab))
      .reduce(badgeReducer, undefined);
  return capBadge(badge);
}));

export const getAppBadge = createSelector(
  [getApplicationsWithNotificationsEnabled, getBadgeForApplication, getSnoozeDuration],
  (applications, badgeForApplication, snooze) => {
    if (snooze) return 'snooze';
    return applications
      .keySeq()
      .map(applicationId => badgeForApplication(applicationId))
      .reduce(badgeReducer, null);
  }
);

export const getTabsAsList = createSelector(
  [getTabs, getApplications, getTabWebcontents, getSubwindows],
  (tabs, applications, tabWebcontents, subwindows) => tabs
    .filter(tab => hasTabApplicationId(tab))
    .filter(tab => applications.has(getTabApplicationId(tab)))
    .map(tab => {
      const tabId = getTabId(tab);

      const twc = tabWebcontents.get(tabId);
      const alreadyLoaded = twc ? Boolean(getWebcontentsId(twc)) : false;
      const doLoad = twc ? Boolean(isWebcontentsWaitingToAttach(twc)) : false;

      const errorCode = getWebcontentsErrorCode(twc);
      const errorDescription = getWebcontentsErrorDescription(twc);
      const loadTab = alreadyLoaded || doLoad;

      const crashed = Boolean(getWebcontentsCrashed(twc));

      const detaching = twc ? Boolean(isWebcontentsDetaching(twc)) : false;
      const mountState = twc && getWebcontentsMountState(twc);
      const isInSubwindow = hasSubwindowsTabId(subwindows, tabId);

      return tab.merge(Immutable.Map({
        loadTab,
        errorCode,
        errorDescription,
        crashed,
        detaching,
        mountState,
        isInSubwindow,
      }));
    }).toList()
);

export const getApplicationsWithManifest = (state: StationState, manifestURL: string) =>
  getApplications(state)
    .filter(app => app.get('manifestURL') === manifestURL);

export const getApplicationCustomURLsWithApplicationId = (state: StationState, applicationId: string): string[] => {
  const customURLs = getApplications(state)
    .filter(app => app.get('applicationId') === applicationId)
    .map((app: ApplicationImmutable): string => app.get('customURL'))
    .filter(customURL => Boolean(customURL))
    .toList().toJS() as string[];

  return customURLs;
};

export const getHomeTab = (state: StationState, applicationId: string) => getTabs(state)
  .find(t =>
    (getTabApplicationId(t) === applicationId) && getTabIsApplicationHome(t));

export const getNotificationsEnabled = (state: StationState, applicationId: string) => {
  const application = getApplicationById(state, applicationId);
  if (!application) return false;

  return application.get('notificationsEnabled');
};

// Value of `isVisible` is either `false` or a windowId
export const getUIConfirmResetApplicationModalIsVisible = (state: StationState, windowId: number) =>
  state.getIn(['ui', 'confirmResetApplicationModal', 'isVisible'], false) === windowId;

// TODO memoize
export const getApplicationDescription = (state: StationState, application) => {
  if (!application) return null;
  const identityId = getApplicationIdentityId(application);
  const subdomain = getApplicationSubdomain(application);

  if (!identityId && !subdomain) return null;

  if (subdomain) {
    return subdomain;
  }

  const identity = getIdentityById(state, identityId);
  if (!identity) return null;

  let description = identity.getIn(['profileData', 'email'], null);

  if (!description) {
    description = identity.get('email', null);
  }

  return `Connected as ${description}`;
};

/**
 * Used by template strings of manifests
 */
export const getApplicationFullConfigData =
  (state: StationState, application: ApplicationImmutable, configData?: ApplicationConfigData) => {
    const minimalConfigData = configData || getConfigData(application);
    if (!minimalConfigData.identityId) {
      return minimalConfigData;
    }

    const userIdentity = getIdentityById(state, minimalConfigData.identityId)!;
    const googleIdentities = getIdentitiesForProvider(state, 'google')
      // it might happen that 2 identities have the same `userId`
      // lets deduplicate them before
      .groupBy((ident: StationUserIdentityImmutable) => ident.get('userId'))
      .map((group: Immutable.Iterable<any, any>) => group.first());

    return {
      ...minimalConfigData,
      moreThanOneIdentity: googleIdentities.size > 1,
      userIdentity: {
        profileData: {
          email: getEmail(userIdentity),
        },
      },
    };
  };

export const getIsApplicationSnoozed = (state: StationState, applicationId: string) =>
  Boolean(getSnoozeDuration(state) || !getNotificationsEnabled(state, applicationId));

export const getFirstApplicationWithAttachedActiveTab = (state: StationState) =>
  getApplications(state)
    .filter(application => {
      const tabId = getApplicationActiveTab(application);
      return !hasSubwindowsTabId(state, tabId);
    })
    .first();

export const orderedManifestsUrls = createSelector(
  getApplicationsWithoutInternals,
  state => state.get('dock'),
  (applications, dock) => dock
    .map((applicationId: string) => applications.get(applicationId))
    .filter(Boolean) // `dock` can be cleared before `applications`
    .toOrderedSet()
    .groupBy(getApplicationManifestURL)
    .map((groupedApps) => getApplicationManifestURL(groupedApps!.first()!))
    .toList()
    .concat(
      applications
        .filter(app => !dock.includes(getApplicationId(app)!))
        .toOrderedSet()
        .groupBy(getApplicationManifestURL)
        .map(groupedApps => getApplicationManifestURL(groupedApps!.first()!))
        .toList()
    )
);
