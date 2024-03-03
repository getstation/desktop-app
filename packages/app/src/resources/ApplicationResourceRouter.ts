import { Store } from 'redux';
import { oc } from 'ts-optchain';
import { dispatchUrl } from '../applications/duck';
import ManifestProvider from '../applications/manifest-provider/manifest-provider';
import { getTabTitle } from '../tabs/get';
import { getTabMatchingURL } from '../tabs/selectors';
import { StationState } from '../types';
import URLRouter from '../urlrouter/URLRouter';
import ApplicationResourceResolver from './ApplicationResourceResolver';
import { ARIT, MetaDataHandlers, OpenHandlers, ResourceMetaData, ResourceRouter } from './types';

export default class ApplicationResourceRouter implements ResourceRouter {
  private readonly store: Store<StationState>;
  private readonly resourceResolver: ApplicationResourceResolver;
  private readonly manifestProvider: ManifestProvider;

  private openHandlers?: OpenHandlers;
  private metaDataHandlers?: MetaDataHandlers;

  /**
   * `bxResourceId` representing an application URL will be handled by this class,
   * resulting in either an action visible to the user, or metadata retrieval.
   */
  constructor(store: Store<StationState>, urlRouter: URLRouter, manifestProvider: ManifestProvider) {
    this.store = store;
    this.resourceResolver = new ApplicationResourceResolver(urlRouter);
    this.manifestProvider = manifestProvider;
  }

  /**
   * Leveraged by the SDK to add dedicated open handlers for some `manifestURL`
   */
  public setOpenHandlers(handlers: OpenHandlers) {
    this.openHandlers = handlers;
  }

  /**
   * Leveraged by the SDK to add dedicated metadata handlers for some `manifestURL`
   */
  public setMetaDataHandlers(handlers: MetaDataHandlers) {
    this.metaDataHandlers = handlers;
  }

  public getResolver() {
    return this.resourceResolver;
  }

  /**
   * Trigger an action visible to the user for the given URL (open a tab, navigate to the tab, open default browser, etc.)
   */
  public async open(url: string) {
    const arit = await this.resourceResolver.resolveARIT(url);
    if (!arit) return;

    const [manifestURL, appURL] = arit;
    const defaultHandler = () => this.defaultOpenHandler(arit);

    const pluginHandler = this.openHandlers && this.openHandlers.get(manifestURL);

    if (pluginHandler) {
      try {
        await pluginHandler(appURL, defaultHandler);
        return Promise.resolve();
      } catch (_) {
        return defaultHandler();
      }
    }

    return defaultHandler();
  }

  /**
   * Retrieve metadata for the given URL
   */
  public async getMetadata(url: string): Promise<ResourceMetaData | null> {
    const arit = await this.resourceResolver.resolveARIT(url);
    if (!arit) return null;

    const [manifestURL, appURL] = arit;
    const defaultMetadata = await this.defaultMetadataHandler(arit);

    const pluginHandler = this.metaDataHandlers && this.metaDataHandlers.get(manifestURL);

    if (pluginHandler) {
      // Gracefully catch plugin metadata handler errors with the defaultMetadata
      try {
        const metadata = await pluginHandler(appURL, defaultMetadata);
        return metadata;
      } catch (_) {
        return defaultMetadata;
      }
    }

    return defaultMetadata;
  }

  /**
   * Default open process: leverage `dispatchUrl` mecanism
   */
  private async defaultOpenHandler([_manifestURL, appURL]: ARIT) {
    this.store.dispatch(dispatchUrl(appURL));
  }

  /**
   * Default metadata process: leverage `manifestProvider`
   */
  private async defaultMetadataHandler(arit: ARIT): Promise<ResourceMetaData> {
    const bxResourceId = ApplicationResourceResolver.fromARIT(arit);

    const [manifestURL, appURL] = arit;
    const { manifest } = await this.manifestProvider.getFirstValue(manifestURL);

    const state = this.store.getState();
    const match = getTabMatchingURL(state, appURL);
    const tabTitle = match && getTabTitle(match.tab);

    return {
      bxResourceId,
      manifestURL,
      url: appURL,
      title: tabTitle || manifest.name || '',
      image: oc(manifest).icons[0].src() || '',
      themeColor: manifest.theme_color,
    };
  }
}
