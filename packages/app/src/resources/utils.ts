import Maybe from 'graphql/tsutils/Maybe';
import ApplicationResourceResolver from './ApplicationResourceResolver';
import ResourceRouterDispatcher from './ResourceRouterDispatcher';
import { ResourceMetaData, ResourceResolver, ResourceRouter } from './types';

export const isResourceRouterForURL = (url: string) => async (router: ResourceRouter) =>
  Boolean(await router.getResolver().resolve(url));

export const chainResourceResolvers = (...resolvers: ResourceResolver[]): ResourceResolver => {
  return {
    async resolve(url: string) {
      for (const resolver of resolvers) {
        const result = await resolver.resolve(url);
        if (result) {
          return result;
        }
      }
      return null;
    },
  };
};

export const metadataToBxResource = (metadata: ResourceMetaData) => ({
  bxResourceId: metadata.bxResourceId,
  manifestURL: metadata.manifestURL,
  iconURL: metadata.image,
  themeColor: metadata.themeColor,
  title: metadata.title,
  secondaryTitle: metadata.description,
});

type BxResource = ReturnType<typeof metadataToBxResource>;

/**
 * Execute given callback only once. Subsequent calls to the result of this function will all wait
 * that the first call is finished before continuing.
 * That way, `firstResolveCb` and `whenFirstCallbackFn` are executed only once.
 * e.g.:
 * const promiseOnce = executePromiseOnce(A);
 * for (...) {
 *   // First call: A -> B -> X -> C
 *   // Subsequent calls: X -> C
 *   // X is resolved when first call to A and B is finished
 *   promiseOnce(B).then(C);
 * }
 * @param firstResolveCb
 */
const executePromiseOnce = <T>(firstResolveCb: () => Promise<T>) => {
  let executedPromise: Promise<void> | undefined;
  return (whenFirstCallbackFn: (obj: T) => void): Promise<any> => {
    if (!executedPromise) {
      executedPromise = firstResolveCb().then(whenFirstCallbackFn);
    }
    return executedPromise;
  };
};

/**
 * If a prop is not available on the subject, `dynamicFetchFn` is called to gather external info in order to be assigned to the subject.
 * If another prop is not available and `dynamicFetchFn` is not yet resolved, the resolution is "paused" by waiting for `dynamicFetchFn`
 * to finish.
 * The side-effect is that some props will be resolved as Promise.
 * @param dynamicFetchFn
 */
const graphQLResolverProxyHandler = (dynamicFetchFn: () => Promise<BxResource>): ProxyHandler<Partial<BxResource>> => {
  const promiseOnce = executePromiseOnce(dynamicFetchFn);
  return {
    get: (obj, prop) => {
      if (!(prop in obj)) {
        // We can have an async getter here because it is used by GraphQL resolvers
        return promiseOnce(newObj => Object.assign(obj, newObj)).then(() => obj[prop]);
      }
      return obj[prop];
    },
  };
};

export const getBxResourceForManifestURLAndURL = async (
  resourceRouter: ResourceRouterDispatcher,
  manifestURL: string,
  url: string
): Promise<BxResource> => {
  const bxResourceId = ApplicationResourceResolver.fromARIT([manifestURL, url]);

  // Each keys of this Proxy are potentially a Promise.
  // This shouldn't cause any issue if this method is only used inside GraphQL resolvers
  return new Proxy({ bxResourceId }, graphQLResolverProxyHandler(async () => {
    const metadata = await resourceRouter.applicationResourceRouter.getMetadata(bxResourceId);
    if (!metadata) {
      throw new Error('Unable to find metadata');
    }

    return metadataToBxResource(metadata);
  })) as BxResource;
};

export const getBxResourceForBxResourceId = async (
  resourceRouter: ResourceRouterDispatcher,
  bxResourceId: Maybe<string>
): Promise<BxResource> => {
  if (!bxResourceId) throw new Error('bxResourceId must not be null, undefined or empty');

  const metadata = await resourceRouter.getMetadata(bxResourceId);
  if (!metadata) {
    throw new Error('Unable to find metadata');
  }

  return metadataToBxResource(metadata);
};
