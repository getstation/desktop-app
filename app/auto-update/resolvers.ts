import { map } from 'rxjs/operators';
import { subscribeStore } from '../utils/observable';
import { Resolvers } from '../graphql/resolvers-types.generated';
import { isDownloadingUpdate, isCheckingUpdate, isUpdateAvailable, getReleaseName } from './selectors';
import { checkForUpdates, quitAndInstall } from './duck';

export type AutoUpdateStatusParent = {};

const resolvers: Resolvers = {
  Query: {
    autoUpdateStatus: () => ({}),
  },
  AutoUpdateStatus: {
    isDownloadingUpdate: (_obj, _args, context) => {
      return subscribeStore(context.store, isDownloadingUpdate)
        .pipe(map(Boolean));
    },
    isCheckingUpdate: (_obj, _args, context) => {
      return subscribeStore(context.store, isCheckingUpdate)
        .pipe(map(Boolean));
    },
    isUpdateAvailable: (_obj, _args, context) => {
      return subscribeStore(context.store, isUpdateAvailable)
        .pipe(map(Boolean));
    },
    releaseName: (_obj, _args, context) => {
      return subscribeStore(context.store, getReleaseName as () => string)
        // Waiting for https://github.com/mesosphere/reactive-graphql/pull/19
        .pipe(map(r => r === undefined ? null : r));
    },
  },
  Mutation: {
    checkForUpdates: (_obj, _args, context) => {
      context.store.dispatch(checkForUpdates());
      return true;
    },
    quitAndInstall: (_obj, _args, context) => {
      context.store.dispatch(quitAndInstall());
      return true;
    },
  },
};

export default resolvers;
