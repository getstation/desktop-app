import { prop } from 'ramda';
import * as Immutable from 'immutable';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { subscribeStore } from '../utils/observable';
import { Resolvers } from '../graphql/resolvers-types.generated';

import { getAppAutoLaunchEnabledStatus, getAppHideMainMenuStatus, getAppMinimizeToTrayStatus, getPromptDownloadEnabled } from './selectors';
import { getStationStatus } from '../app/selectors';
import { enableAutoLaunch, hideMainMenu, minimizeToTray, togglePromptDownload } from './duck';

const resolvers: Resolvers = {
  Query: {
    autoLaunchEnabled: (_obj, _args, context) => {
      return subscribeStore(context.store, getAppAutoLaunchEnabledStatus)
        .pipe(map(Boolean), distinctUntilChanged());
    },
    hideMainMenu: (_obj, _args, context) => {
      return subscribeStore(context.store, getAppHideMainMenuStatus)
        .pipe(map(Boolean), distinctUntilChanged());
    },
    minimizeToTray: (_obj, _args, context) => {
      return subscribeStore(context.store, getAppMinimizeToTrayStatus)
        .pipe(map(Boolean), distinctUntilChanged());
    },
    promptDownloadEnabled: (_obj, _args, context) => {
      return subscribeStore(context.store, getPromptDownloadEnabled)
        .pipe(map(Boolean), distinctUntilChanged());
    },
    stationStatus: (_obj, _args, context) => {
      return subscribeStore(
        context.store,
        state => getStationStatus(state)
      ).pipe(distinctUntilChanged(Immutable.is), map(x => x.toJS()));
    },
  },

  Mutation: {
    setAutoLaunch: (_obj, args, context) => {
      context.store.dispatch(enableAutoLaunch(args.enabled));
      return true;
    },
    setHideMainMenu: (_obj, args, context) => {
      context.store.dispatch(hideMainMenu(args.hide));
      return true;
    },
    setMinimizeToTray: (_obj, args, context) => {
      context.store.dispatch(minimizeToTray(args.enabled));
      return true;
    },
    setPromptDownload: (_obj, args, context) => {
      context.store.dispatch(togglePromptDownload(args.enabled));
      return true;
    },
  },

  StationStatus: {
    isOnline: prop('isOnline'),
    focus: prop('focus'),
  },
};

export default resolvers;
