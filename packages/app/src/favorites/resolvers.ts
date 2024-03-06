import { map, skipWhile, take } from 'rxjs/operators';
import { Resolvers } from '../graphql/resolvers-types.generated';
import { getFavoriteMatchingTab, getFavorite } from './selectors';
import { navigateToApplicationTabAutomatically, createNewTab } from '../applications/duck';
import { ImmutableMap, InnerRecursiveImmutableMap, StationState, StationStore } from '../types';
import { StationRawState } from '../state';
import { closeTab } from '../tabs/duck';
import { removeFavorite } from './duck';
import { detach } from '../subwindows/duck';
import { subscribeStore } from '../utils/observable';
import { getTabMatchingURL, getDuplicateTabsByURLFilteredByApplicationId } from '../tabs/selectors';

const resolvers: Resolvers = {
  Query: {
  },

  Mutation: {
    selectFavorite: (
      _obj,
      { id },
      { store },
    ) => {
      const { favorite, matchingTab } = getFavoriteAndMatchingTab(store.getState(), id);
      const favoriteUrl = favorite.get('url');
      const favoriteAppId = favorite.get('applicationId');

      if (!matchingTab) {
        store.dispatch(
          createNewTab(favoriteAppId, favoriteUrl, { navigateToApplication: true })
        );
      } else {
        store.dispatch(
          navigateToApplicationTabAutomatically(matchingTab.get('tabId'))
        );
      }

      return true;
    },

    closeFavorite: (
      _obj,
      { id },
      { store },
    ) => {
      const state = store.getState();
      const favorite = getFavorite(state, id);
      if (!favorite) throw new Error(`No favorite found with id ${id}`);

      const favoriteUrl = favorite.get('url');
      const favoriteAppId = favorite.get('applicationId');

      // Look for duplicates
      const duplicatedTabs = getDuplicateTabsByURLFilteredByApplicationId(state, favoriteAppId);
      const duplicateds = duplicatedTabs.get(favoriteUrl);

      // If we found duplicates for our URL, delete them all
      if (duplicateds) {
        duplicateds.map(tab => store.dispatch(closeTab(tab.get('tabId'))));
      // If not, check if we had a single tab matching our URL
      } else {
        const matchingTab = getFavoriteMatchingTab(state, id);
        if (matchingTab) store.dispatch(closeTab(matchingTab.get('tabId')));
      }

      // No matter what, remove the favorite
      store.dispatch(removeFavorite(favorite.get('favoriteId'), null));

      return true;
    },

    detachFavorite: async (
      _obj,
      { id },
      { store },
    ) => {
      const state = store.getState();
      // tslint:disable-next-line: prefer-const : We need matchingTab to be updatable
      let { favorite, matchingTab } = getFavoriteAndMatchingTab(state, id);

      // If not matching tab, create one new and get it
      if (!matchingTab) {
        matchingTab = await createAndWaitTabInStore(
          store,
          { applicationId: favorite.get('applicationId'), url: favorite.get('url') }
        );
      }

      store.dispatch(detach(matchingTab.get('tabId')));
      return true;
    },

    unpinFavorite: async (
      _obj,
      { id },
      { store },
    ) => {
      // tslint:disable-next-line: prefer-const : We need matchingTab to be updatable
      let { favorite, matchingTab } = getFavoriteAndMatchingTab(store.getState(), id);

      // If not matching tab, create one new and get it
      if (!matchingTab) {
        matchingTab = await createAndWaitTabInStore(
          store,
          { applicationId: favorite.get('applicationId'), url: favorite.get('url') }
        );
      }

      store.dispatch(removeFavorite(favorite.get('favoriteId'), matchingTab.get('tabId')));
      return true;
    },
  },

  Favorite: {
  },
};

// UTILS

const getFavoriteAndMatchingTab = (
  state: ImmutableMap<InnerRecursiveImmutableMap<StationRawState>>,
  id: string
) => {
  const favorite = getFavorite(state, id);
  if (!favorite) throw new Error(`No favorite found with id ${id}`);
  const matchingTab = getFavoriteMatchingTab(state, id);

  return {
    favorite,
    matchingTab,
  };
};

const createAndWaitTabInStore = async (
  store: StationStore,
  { applicationId, url }: { applicationId: string, url: string},
) => {
  store.dispatch(createNewTab(
    applicationId,
    url,
  ));

  const matchingTab = await subscribeStore(store)
    .pipe(
      map((state: StationState) => getTabMatchingURL(state, url)),
      skipWhile((tab) => !Boolean(tab)),
      take(1)
    )
    .toPromise();

  if (!matchingTab) throw new Error('Could not create a new tab when detaching');
  return matchingTab.tab;
};

// EXPORT

export default resolvers;
