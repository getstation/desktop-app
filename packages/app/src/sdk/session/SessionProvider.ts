import { session } from '@getstation/sdk';
import { flatten, uniq } from 'ramda';
import { Store } from 'redux';
import { parse as parseURL } from 'url';
import { getApplicationId } from '../../applications/get';
import { getApplicationsByManifestURL } from '../../applications/selectors';
import services from '../../services/servicesManager';
import { getTabURL } from '../../tabs/get';
import { getTabsForApplication } from '../../tabs/selectors';
import { StationTab } from '../../tabs/types';
import { RecursiveImmutableList, StationState } from '../../types';
import { AbstractProvider } from '../common';

export default class SessionProvider extends AbstractProvider<session.SessionConsumer> {

  protected store: Store<StationState>;

  constructor(store: Store<StationState>) {
    super();
    this.store = store;
  }

  addConsumer(consumer: session.SessionConsumer) {
    super.pushConsumer(consumer);
    consumer.setProviderInterface(this.getProviderInterface());
    super.subscribeConsumer(consumer, () => {});
  }

  getProviderInterface(): session.SessionProviderInterface {
    return {
      getUserAgent: this.getUserAgent.bind(this),
      getCookies: this.getCookies.bind(this),
    };
  }

  getUserAgent(): Promise<string> {
    return services.defaultSession.getUserAgent();
  }

  async getCookies(manifestURL: string): Promise<any> {
    const state = this.store.getState();
    const installedApplications = getApplicationsByManifestURL(state, manifestURL);
    const tabs: RecursiveImmutableList<StationTab[]> = installedApplications
      .toList()
      .map(application => getTabsForApplication(state, getApplicationId(application)))
      .flatten(1) as any;

    const hostnames: string[] = tabs
      .map(getTabURL)
      .filter(Boolean)
      .map((tabUrl: string) => parseURL(tabUrl).hostname)
      .toJS() as any;

    const cookiesByHostname = await Promise.all(
      uniq(hostnames)
        .map((hostname: string) => {
          return services.defaultSession.getCookies({ domain: hostname });
        }),
    );

    return flatten(cookiesByHostname);
  }
}
