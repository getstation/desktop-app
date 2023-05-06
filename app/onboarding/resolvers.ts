import { Resolvers, Platform as GqlPlatform } from '../graphql/resolvers-types.generated';
import { installApplication } from '../applications/sagas/lifecycle';
import { Platform, InstallContext } from '../applications/types';
import { appStoreStepFinished } from './duck';
import { getManifestOrTimeout } from '../applications/api';
import { MultiInstanceConfigPreset } from '../applications/manifest-provider/types';
import { getFirstIdentityForProvider } from '../user-identities/selectors';
import { InstallApplicationConfiguration } from './queries@local.gql.generated';

const platforms: Record<GqlPlatform, Platform> = {
  [GqlPlatform.PlatformAppstore]: Platform.AppStore,
};

const isConfigurationEmpty = (config?: InstallApplicationConfiguration | null): boolean => {
  return !config?.subdomain && !config?.customURL;
};

const resolvers: Resolvers = {
  Mutation: {
    installApplication: async (_obj, args, ctx) => {
      const { manifestURL, context: installApplicationContext, configuration } = args.input;

      const installContext: InstallContext = {
        id: installApplicationContext.id,
        platform: platforms[installApplicationContext.platform],
        onboardeeApplicationAssignmentId: installApplicationContext.onboardeeApplicationAssignment || undefined,
      };

      let identityId: string | undefined;
      const manifest = await getManifestOrTimeout(ctx.manifestProvider, manifestURL);
      const presets = manifest.bx_multi_instance_config?.presets ?? [];

      if (isConfigurationEmpty(configuration) && presets.includes(MultiInstanceConfigPreset.GoogleAccount)) {
        const state = ctx.store.getState();
        identityId = getFirstIdentityForProvider(state, 'google')?.get('identityId') ?? undefined;
      }

      const options = {
        installContext,
        subdomain: configuration?.subdomain ?? undefined,
        customURL: configuration?.customURL ?? undefined,
        identityId,
      };
      const { applicationId } = await ctx.store.runSaga(installApplication, manifestURL, options).toPromise();
      return { applicationId };
    },
    onboardingDone: async (_obj, args, context) => {
      context.store.dispatch(appStoreStepFinished(args.nbInstalledApps, args.onboardeeId ?? undefined));
      return true;
    },
  },
};

export default resolvers;
