import { Store } from 'redux';
import ManifestProvider from '../applications/manifest-provider/manifest-provider';
import { StationState } from '../types';
import URLRouter from '../urlrouter/URLRouter';
import ApplicationResourceRouter from './ApplicationResourceRouter';
import { ResourceMetaData, ResourceResolver, ResourceRouter } from './types';
import { chainResourceResolvers, isResourceRouterForURL } from './utils';

/**
 * This is the generic entrypoint for URLs (and more particularly `bxResourceId`) that should
 * be treated as resources, on which we want to trigger different actions (open, get metadata).
 * For now, it only has one actual router: `ApplicationResourceRouter`
 */
export default class ResourceRouterDispatcher implements ResourceRouter {
  public applicationResourceRouter: ApplicationResourceRouter;

  constructor(store: Store<StationState>, urlRouter: URLRouter, manifestProvider: ManifestProvider) {
    this.applicationResourceRouter = new ApplicationResourceRouter(store, urlRouter, manifestProvider);
  }

  public async open(url: string): Promise<void> {
    const router = await this.getResourceRouter(url);
    return router.open(url);
  }

  public async getMetadata(url: string): Promise<ResourceMetaData | null> {
    const router = await this.getResourceRouter(url);
    return router.getMetadata(url);
  }

  public getResolver(): ResourceResolver {
    return chainResourceResolvers(...this.getResolvers());
  }

  private getResolvers(): ResourceResolver[] {
    return this.getRouters().map(router => router.getResolver());
  }

  private getRouters(): ResourceRouter[] {
    return [
      // list of all resource routers here.
      this.applicationResourceRouter,
    ];
  }

  private async getResourceRouter(url: string) {
    const findFn = isResourceRouterForURL(url);
    for (const router of this.getRouters()) {
      if (await findFn(router)) {
        return router;
      }
    }
    throw new Error(`No router to resolve resource '${url}'`);
  }
}
