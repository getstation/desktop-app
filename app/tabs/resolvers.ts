import { getApplicationManifestURL } from '../applications/get';
import { getApplicationById } from '../applications/selectors';
import { getApplicationByTabId } from '../tabs/selectors';
import { APPLICATIONS_WITH_CUSTOM_SUBDOCK_TITLE } from '../applications/manifest-provider/const';
import { Resolvers } from '../graphql/resolvers-types.generated';
import { reorderFavorite } from '../ordered-favorites/duck';
import { reorderTab } from '../ordered-tabs/duck';
import { getBxResourceForManifestURLAndURL } from '../resources/utils';

const resolvers: Resolvers = {
  Query: {
  },

  Mutation: {
    reorderTab: (_obj, args, context) => {
      context.store.dispatch(reorderTab(args.tabId, args.newPosition));
      return true;
    },
    reorderFavorite: (_obj, args, context) => {
      context.store.dispatch(reorderFavorite(args.favoriteId, args.newPosition));
      return true;
    },
  },

  Tab: {
    associatedBxResource: async ({ url, applicationId }, _payload, { resourceRouter, store }) => {
      const state = store.getState();
      const application = getApplicationById(state, applicationId!);
      if (!application) {
        throw new Error('Unable to find application');
      }

      if (!url) {
        return undefined;
      }

      const manifestURL = getApplicationManifestURL(application);
      return getBxResourceForManifestURLAndURL(resourceRouter, manifestURL, url);
    },

    specificIconId: async ({ tabId, url }, _payload, { store }) => {
      if (!tabId || !url) return;

      const state = store.getState();
      const application = getApplicationByTabId(state, tabId);

      if (!application) return;

      const manifestURL = application.get('manifestURL');

      if (!(manifestURL in APPLICATIONS_WITH_CUSTOM_SUBDOCK_TITLE)) return;

      const matchingItem = APPLICATIONS_WITH_CUSTOM_SUBDOCK_TITLE[manifestURL]
        .find(item => item.regex.test(url));

      return (matchingItem) ? matchingItem.icon : undefined;
    },
  },
};

export default resolvers;
