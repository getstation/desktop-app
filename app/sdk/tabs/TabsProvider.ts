import { Consumer, tabs } from '@getstation/sdk';
import { is } from 'immutable';
import { equals } from 'ramda';
import { Store } from 'redux';
import { distinctUntilChanged, filter, map, scan, share } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx';
import { getFocusedTabId } from '../../app/selectors';
import { createNewTab, navigateToApplicationTabAutomatically } from '../../applications/duck';
import { getApplicationId, getApplicationManifestURL } from '../../applications/get';
import { getApplicationById, getApplicationsByManifestURL } from '../../applications/selectors';
import services from '../../services/servicesManager';
import { navigateTabToURL } from '../../tab-webcontents/duck';
import {
  getTabWebcontents,
  getWebcontentsCrashed,
  isWebcontentsDetaching,
  isWebcontentsMounted,
  isWebcontentsWaitingToAttach,
} from '../../tab-webcontents/selectors';
import { getTabById, getTabs, getTabsForApplication } from '../../tabs/selectors';
import { StationTab, StationTabImmutable } from '../../tabs/types';
import { StationState } from '../../types';
import { subscribeStore } from '../../utils/observable';
import { AbstractProvider } from '../common';
import { UnmountedWebView } from '../errors';

export default class TabsProvider extends AbstractProvider<tabs.TabsConsumer> {

  protected store: Store<StationState>;
  protected observableState: Observable<StationState>;
  protected defaultNavToTabOptions = { silent: false };

  constructor(store: Store<StationState>) {
    super();
    this.store = store;
    this.observableState = subscribeStore(store).pipe(share<StationState>());
  }

  addConsumer(consumer: tabs.TabsConsumer) {
    super.pushConsumer(consumer);
    consumer.setProviderInterface(this.getProviderInterface());
    super.subscribeConsumer(consumer, () => { });
  }

  getProviderInterface(): tabs.TabsProviderInterface {
    return {
      nav: this.nav.bind(this),
      create: this.create.bind(this),
      getTabs: this.getTabs.bind(this),
      getTab: this.getTab.bind(this),
      updateTab: this.updateTab.bind(this),
      navToTab: this.navToTab.bind(this),
      executeJavaScript: this.executeJavaScript.bind(this),
      getTabWebContentsState: this.getTabWebContentsState.bind(this),
    };
  }

  nav(): Observable<tabs.Nav> {
    return this.observableState
      .pipe(
        map((state: StationState) => getFocusedTabId(state)),
        filter(x => Boolean(x)),
        distinctUntilChanged(),
        scan((nav: Partial<tabs.Nav>, tabId: string) => {
          return {
            tabId,
            previousTabId: nav.tabId,
          };
        }, {}),
        filter((x: Partial<tabs.Nav>) => Boolean(x.tabId)),
        distinctUntilChanged(
          (before: tabs.Nav, after: tabs.Nav) => equals(before, after)
        ),
      );
  }

  create({ applicationId, url }: tabs.CreateOptions) {
    const state = this.store.getState();
    const application = getApplicationById(state, applicationId);
    if (!application) return;

    const manifestURL = getApplicationManifestURL(application);
    if (this.isActiveConsumer(manifestURL)) {
      this.store.dispatch(createNewTab(applicationId, url, { navigateToApplication: true }));
    }
  }

  getTabs(manifestURL: string): tabs.Tab[] {
    const state = this.store.getState();
    const installedApplications = getApplicationsByManifestURL(state, manifestURL);
    return installedApplications
      .map(application =>
        getTabsForApplication(state, getApplicationId(application)).toList()
      )
      .toList()
      .flatten(1)
      .toJS();
  }

  getTab(tabId: string): Observable<StationTab> {
    return this.observableState
      .pipe(
        map((state: StationState) => getTabById(state, tabId)),
        filter((tab: StationTabImmutable | undefined) => Boolean(tab)),
        distinctUntilChanged(
          (before: StationTabImmutable, after: StationTabImmutable) =>
            is(before, after)
        ),
        map((tab: StationTabImmutable) => tab.toJS()),
      );
  }

  updateTab(tabId: string, updatedTab: tabs.TabUpdate) {
    if (updatedTab.url) {
      this.store.dispatch(navigateTabToURL(tabId, updatedTab.url));
    }
  }

  navToTab(tabId: string, { silent }: tabs.NavToTabOptions = this.defaultNavToTabOptions): void {
    const tab = getTabs(this.store.getState()).get(tabId);
    if (tab) {
      this.store.dispatch(navigateToApplicationTabAutomatically(tabId, null, silent));
    } else {
      throw new Error('Tab doesn\'t exists');
    }
  }

  getTabWebContentsState(tabId: string): tabs.TabWebContentsState {
    const tabWebContents = getTabWebcontents(this.store.getState());
    const twc = tabWebContents.get(tabId);

    if (twc) {
      if (getWebcontentsCrashed(twc)) return tabs.TabWebContentsState.crashed;
      if (isWebcontentsWaitingToAttach(twc)) return tabs.TabWebContentsState.waitingToAttach;
      if (isWebcontentsDetaching(twc)) return tabs.TabWebContentsState.detaching;
      if (isWebcontentsMounted(twc)) return tabs.TabWebContentsState.mounted;
    }

    return tabs.TabWebContentsState.notMounted;
  }

  async executeJavaScript(tabId: string, code: string): Promise<any> {
    const state = this.store.getState();
    const tabWebContents = getTabWebcontents(state).find(twc => twc.get('tabId') === tabId);

    if (!Boolean(tabWebContents)) throw new UnmountedWebView();
    const webContentsId = tabWebContents.get('webcontentsId');
    if (!Boolean(webContentsId)) throw new UnmountedWebView();
    return services.tabWebContents.executeJavaScript(webContentsId, code);
  }

  private isActiveConsumer(manifestURL: string): boolean {
    return this._consumers.map((c: Consumer) => c.id).includes(manifestURL);
  }
}
