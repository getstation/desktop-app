import { StationState } from '../types';
import { ApplicationImmutable } from '../applications/types';
import { BxAppManifest } from '../applications/manifest-provider/bxAppManifest';
import { interpretedIconUrl } from '../applications/helpers';
import { label, applicationLabel } from '../abstract-application/helpers';
import {
  getApplicationManifestURL,
  getApplicationId,
} from '../applications/get';
import { SectionKinds } from '../bang/api';
import { getFavorite } from '../favorites/selectors';
import { StationFavoriteImmutable } from '../favorites/types';
import { StationTabImmutable } from '../tabs/types';
import {
  getTabIsApplicationHome,
  getTabTitle,
  getTabId,
  getTabURL,
  getFavicon,
} from '../tabs/get';

import { ActivityEntry } from './types';

export const tabAsActivityEntry = (
  tab: StationTabImmutable,
  application: ApplicationImmutable,
  manifest: BxAppManifest,
  state: StationState
): ActivityEntry => {
  const isApplicationHome = getTabIsApplicationHome(tab);
  const title = getTabTitle(tab) || '';
  const appLabel = applicationLabel(state, manifest, application);

  const shouldUseFavicon = !isApplicationHome;

  return {
    resourceId: getTabId(tab),
    url: getTabURL(tab),
    sectionKind: isApplicationHome ? 'apps' : 'app-specific',
    type: isApplicationHome ? 'station-app' : 'tab',
    category: isApplicationHome ? SectionKinds.getCategory('apps') : appLabel,
    imgUrl: shouldUseFavicon ? getFavicon(tab) : interpretedIconUrl(manifest),
    themeColor: shouldUseFavicon ? undefined : manifest.theme_color,
    label: isApplicationHome ? manifest.name || '' : title,
    context: label(state, manifest, application),
    additionalSearchString: [appLabel, title || ''].join(' '),
    manifestURL: getApplicationManifestURL(application),
    applicationId: getApplicationId(application),
  };
};

export const favoriteAsActivityEntry = (
  favorite: StationFavoriteImmutable,
  application: ApplicationImmutable,
  manifest: BxAppManifest,
  state: StationState
): ActivityEntry => {
  const favoriteId = favorite.get('favoriteId');
  const tab: StationTabImmutable = getFavorite(state, favoriteId) as StationTabImmutable;

  return {
    resourceId: favoriteId,
    type: 'favorite',
    category: applicationLabel(state, manifest, application),
    imgUrl: getFavicon(tab)!,
    themeColor: manifest.theme_color,
    label: getTabTitle(tab)!,
    additionalSearchString: applicationLabel(state, manifest, application),
    url: getTabURL(tab),
    sectionKind: 'app-specific',
    applicationId: getApplicationId(application),
  };
};
