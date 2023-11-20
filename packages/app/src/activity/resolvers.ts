// @ts-ignore: no declaration file
import * as isBlank from 'is-blank';
import { createSelector } from 'reselect';
import { map } from 'rxjs/operators';

import { getTabApplicationId, getTabTitle } from '../tabs/get';
import { getApplicationManifestURL } from '../applications/get';
import { getApplicationsWithUserIdentity } from '../applications/compartmentalizedSelectors';
import { Resolvers } from '../graphql/resolvers-types.generated';
import { getHistoryItems } from '../history/selectors';
import { getBxResourceForManifestURLAndURL } from '../resources/utils';
import { getResultsJS } from '../bang/selectors';
import { getTabsSortedByLastActivityAt } from '../tabs/selectors';
import { StationTabImmutable } from '../tabs/types';
import { subscribeStore } from '../utils/observable';
import { flattenResults } from '../bang/api';
import { setSearchValue } from '../bang/duck';

import { tabAsActivityEntry } from './helpers';

const resolvers: Resolvers = {
  Query: {
    activity: (_, args, context) => {
      const { query } = args;
      const { store, manifestProvider } = context;

      // Search
      if (query) {
        store.dispatch(setSearchValue(query));
        return subscribeStore(store, getResultsJS)
          .pipe(map(flattenResults));
      }

      // History
      return subscribeStore(
        store,
        createSelector(
          state => state,
          getHistoryItems,
          getApplicationsWithUserIdentity,
          getTabsSortedByLastActivityAt,
          (state, history, applications, tabsSortedByLastActivityAt) =>
            history.size > 0 ? history.toJS() :
              tabsSortedByLastActivityAt
                .filter((tab: StationTabImmutable) =>
                  !isBlank(getTabTitle(tab)) &&
                  applications.has(getTabApplicationId(tab)))
                .reverse()
                .slice(0, 8)
                .map(async (tab: StationTabImmutable) => {
                  const application = applications.get(getTabApplicationId(tab));
                  const { manifest } = await manifestProvider.getFirstValue(
                    getApplicationManifestURL(application)
                  );

                  return tabAsActivityEntry(tab, application, manifest, state);
                })
                .toJS()
        )
      );
    },
  },

  ActivityEntry: {
    resourceId: async (root) => (await root).resourceId,
    category: async (root) => (await root).category,
    additionalSearchString: async (root) => (await root).additionalSearchString,
    manifestURL: async (root) => (await root).manifestURL,
    label: async (root) => (await root).label,
    context: async (root) => (await root).context,
    url: async (root) => (await root).url,
    imgUrl: async (root) => (await root).imgUrl,
    themeColor: async (root) => (await root).themeColor,
    onSelect: async (root) => (await root).onSelect,
    type: async (root) => (await root).type,
    uniqId: async (root) => (await root).uniqId,
    sectionKind: async (root) => (await root).sectionKind,
    date: async (root) => (await root).date,
    applicationId: async (root) => (await root).applicationId,
    associatedBxResource: async ({ url, manifestURL }, _payload, { resourceRouter }) => {
      if (!url || !manifestURL) {
        return undefined;
      }

      return getBxResourceForManifestURLAndURL(resourceRouter, manifestURL, url);
    },
  },

  BxResource: {
    bxResourceId: async (root) => (await root).bxResourceId,
    manifestURL: async (root) => (await root).manifestURL,
    iconURL: async (root) => (await root).iconURL,
    themeColor: async (root) => (await root).themeColor,
    title: async (root) => (await root).title,
    secondaryTitle: async (root) => (await root).secondaryTitle,
  },
};

export default resolvers;
