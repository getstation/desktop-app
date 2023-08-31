import { List } from 'immutable';
import * as memoize from 'memoizee';
import { map } from 'rxjs/operators';
import { Resolvers } from '../graphql/resolvers-types.generated';
import { subscribeStore } from '../utils/observable';
import { combineLatest } from 'rxjs';
import { getSettingsByManifestURL } from '../application-settings/selectors';
import extensions from '../chrome-extensions/data';
import { getApplicationsByManifestURL, getInstalledManifestURLs, getHomeTab } from '../applications/selectors';
import { getLink } from '../password-managers/selectors';
import { StationState } from '../types';
import {
  BxAppManifest,
} from '../applications/manifest-provider/bxAppManifest';
import {
  getApplicationId,
  getApplicationIconURL,
} from '../applications/get';
import { ApplicationImmutable } from '../applications/types';
import { interpretedIconUrl } from '../applications/helpers';
import {
  label,
  isConfigurationRequired,
  getChromeExtensionId,
} from './helpers';
import { getTabURL } from '../tabs/get';

const resolvers: Resolvers = {
  Query: {
    abstractApplication: (_, { manifestURL }, _context) => {
      return { manifestURL };
    },
  },
  Mutation: {
    checkForUpdatesApplication: (_obj, args, context) => {
      context.manifestProvider.update(args.manifestURL);
      return true;
    },
  },
  AbstractApplication: {
    manifestCheckedAt: ({ manifestURL }, __, context) => {
      const { manifestProvider } = context;

      return manifestProvider.get(manifestURL!)
        .pipe(map(bxApp => bxApp.lastChecked.fromNow()));
    },
    manifest: ({ manifestURL }, __, context) => {
      const { manifestProvider } = context;

      return manifestProvider.get(manifestURL!)
        .pipe(map(bxApp => bxApp.manifest));
    },
    settings: ({ manifestURL }, __, context) =>
      subscribeStore(
        context.store,
        state => getSettingsByManifestURL(state, manifestURL!)
      ),
    instances: ({ manifestURL }, __, context) =>
      combineLatest(
        subscribeStore(context.store, state => state),
        context.manifestProvider.get(manifestURL!)
          .pipe(map(bxApp => bxApp.manifest)),
        (state: StationState, manifest: BxAppManifest) => {
          const applications = getApplicationsByManifestURL(state, manifestURL!);

          return applications
            .valueSeq()
            .map((application: ApplicationImmutable) => {
              const link = getLink(state, getApplicationId(application));
              const id = getApplicationId(application);
              const name = label(state, manifest, application);
              const logoUrl = getApplicationIconURL(application) || interpretedIconUrl(manifest);
              const homeTabUrl = getTabURL(getHomeTab(state, id)) || '';
              const needConfiguration = isConfigurationRequired(manifest, application, homeTabUrl);
              const passwordManagerLink = link ? link.toJS() : { providerId: '', instanceId: '' };

              return { id, name, logoUrl, needConfiguration, passwordManagerLink };
            })
            .toJS();
        }
      ),
    extensions: ({ manifestURL }, __, context) =>
      combineLatest(
        subscribeStore(
          context.store,
          getInstalledManifestURLs
        ),
        ...extensions
          .filter(e => e.extensionFor.includes(manifestURL!))
          .map(e => context.manifestProvider.get(e.manifestURL).pipe(map(m => ({ ...m, manifestURL: e.manifestURL })))),
        memoize((manifestURLs: List<string>, ...extensionsManifests: any[]) =>
          extensionsManifests.map(extensionManifest => {
            const { manifest } = extensionManifest;

            return {
              manifestURL: extensionManifest.manifestURL,
              id: getChromeExtensionId(manifest),
              name: manifest.name!,
              iconUrl: interpretedIconUrl(manifest)!,
              added: manifestURLs.includes(extensionManifest.manifestURL),
            };
          })
        )),
  },
};

export default resolvers;
