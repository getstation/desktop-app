import * as Immutable from 'immutable';
import * as models from '../database/model';
import getPasswordManagerLinks from '../password-managers/persistence/passwordManagerLinks';
import getPasswordManagers from '../password-managers/persistence/passwordManagers';
import { ServicesDataProxyMixin } from '../plugins/persistence';
import getUIProxy from '../ui/persistence/proxy';
import { KeyValueStateProxy, ListStateProxy, MapStateProxy, SingletonStateProxy, StateProxy } from './backend';
import { ListProxyMixin, MapProxyMixin, SingletonProxyMixin } from './mixins';

const {
  App,
  Application,
  Dock,
  Favorite,
  Identity,
  Nav,
  Onboarding,
  ProfileData,
  ApplicationSettings,
  Subwindow,
  Tab,
  User,
  UserWeeklyUsage,
  TabsSubdockOrder,
  FavoritesSubdockOrder,
} = models;

export const getVersion = () => App.findOne().then((result: any) => {
  if (!result) return null;
  return result.version;
});

export const setVersion = (version: any) => App.findOne().then((result: any) => {
  if (!result) {
    // Do nothing, it will be created by first `app` create
    return;
  }
  result.version = version; // eslint-disable-line
  return result.save();
});

export class ProfileDataProxy extends MapProxyMixin({
  model: ProfileData,
  key: 'email',
  mapStateToObject: async state => ({
    displayName: state.get('displayName'),
    email: state.get('email'),
    imageURL: state.get('imageURL'),
  }),
  mapObjectToState: async obj => Immutable.Map({
    displayName: obj.displayName,
    email: obj.email,
    imageURL: obj.imageURL,
  }),
}) {
}

export class IdentityProxy extends MapProxyMixin({
  model: Identity,
  key: 'identityId',
  mapStateToObject: async state => {
    if (!state) return {};
    const obj: any = {
      accessToken: state.get('accessToken'),
      identityId: state.get('identityId'),
      provider: state.get('provider'),
      refreshToken: state.get('refreshToken'),
      userId: state.get('userId'),
    };
    // Create profileData if it does not exists
    if (state.has('profileData')) {
      const profileData = state.get('profileData');
      obj.profileDataId = (await ProfileDataProxy.findOrCreate(profileData)).get().profileDataId;
    }
    return obj;
  },
  mapObjectToState: async obj => Immutable.Map({
    accessToken: obj.accessToken,
    identityId: obj.identityId,
    provider: obj.provider,
    refreshToken: obj.refreshToken,
    userId: obj.userId,
    profileData: await ProfileDataProxy.mapObjectToStateOrNull(await obj.getProfileData()),
  }),
}) {
}

export class ApplicationProxy extends MapProxyMixin({
  model: Application,
  key: 'applicationId',
  mapStateToObject: async state => {
    const installContext = state.get('installContext');
    return {
      applicationId: state.get('applicationId'),
      manifestURL: state.get('manifestURL'),
      installContext: JSON.stringify(installContext ? installContext.toJS() : undefined),
      activeTabId: state.get('activeTab'),
      iconURL: state.get('iconURL'),
      // todo(app-323): remove `serviceId`
      serviceId: state.get('serviceId'),
      notificationsEnabled: state.get('notificationsEnabled'),
      identityId: state.get('identityId'),
      subdomain: state.get('subdomain'),
      customURL: state.get('customURL'),
    };
  },
  mapObjectToState: async obj => Immutable.Map({
    applicationId: obj.applicationId,
    manifestURL: obj.manifestURL,
    installContext: obj.installContext ? Immutable.Map(JSON.parse(obj.installContext)) : null,
    activeTab: obj.activeTabId,
    iconURL: obj.iconURL,
    // todo(app-323): remove `serviceId`
    serviceId: obj.serviceId,
    notificationsEnabled: obj.notificationsEnabled,
    identityId: obj.identityId,
    subdomain: obj.subdomain,
    customURL: obj.customURL,
  }),
}) {
}

const serializeFavicons = (state: Immutable.Map<string, any>) => {
  const favicons = state.get('favicons', null);
  if (!favicons) return null;
  return JSON.stringify(favicons.toArray());
};

const unserializeFavicons = (obj: any) => {
  if (!obj.favicons) return null;
  return Immutable.List(JSON.parse(obj.favicons));
};

export class TabProxy extends MapProxyMixin({
  model: Tab,
  key: 'tabId',
  mapStateToObject: async state => ({
    applicationId: state.get('applicationId'),
    isApplicationHome: state.get('isApplicationHome'),
    tabId: state.get('tabId'),
    title: state.get('title'),
    url: state.get('url'),
    favicons: serializeFavicons(state),
    lastActivityAt: state.get('lastActivityAt'),
  }),
  mapObjectToState: async obj => Immutable.Map({
    applicationId: obj.applicationId,
    isApplicationHome: obj.isApplicationHome,
    tabId: obj.tabId,
    title: obj.title,
    url: obj.url,
    favicons: unserializeFavicons(obj),
    lastActivityAt: obj.lastActivityAt,
  }),
}) {
}

export class FavoriteProxy extends MapProxyMixin({
  model: Favorite,
  key: 'favoriteId',
  mapStateToObject: async state => ({
    applicationId: state.get('applicationId'),
    favoriteId: state.get('favoriteId'),
    title: state.get('title'),
    url: state.get('url'),
    favicons: serializeFavicons(state),
  }),
  mapObjectToState: async obj => Immutable.Map({
    applicationId: obj.applicationId,
    favoriteId: obj.favoriteId,
    title: obj.title,
    url: obj.url,
    favicons: unserializeFavicons(obj),
  }),
}) {
}

export class AppProxy extends SingletonProxyMixin({
  model: App,
  mapStateToObject: async state => ({
    version: state.get('version'),
    autoLaunchEnabled: state.get('autoLaunchEnabled'),
    hideMainMenu: state.get('hideMainMenu'),
    downloadFolder: state.get('downloadFolder'),
    promptDownload: state.get('promptDownload'),
  }),
  mapObjectToState: async obj => Immutable.Map({
    version: obj.version,
    autoLaunchEnabled: obj.autoLaunchEnabled,
    hideMainMenu: obj.hideMainMenu,
    downloadFolder: obj.downloadFolder,
    promptDownload: Boolean(obj.promptDownload),
  }),
}) {
}

export class NavProxy extends SingletonProxyMixin({
  model: Nav,
  mapStateToObject: async state => ({
    previousTabApplicationId: state.get('previousTabApplicationId'),
    tabApplicationId: state.get('tabApplicationId'),
  }),
  mapObjectToState: async obj => Immutable.Map({
    previousTabApplicationId: obj.previousTabApplicationId,
    tabApplicationId: obj.tabApplicationId,
  }),
}) {
}

export class UserProxy extends SingletonProxyMixin({
  model: User,
  mapStateToObject: async state => ({
    email: state.get('email'),
    userId: state.get('id'),
    name: state.get('name'),
    firstName: state.get('firstName'),
    lastName: state.get('lastName'),
    picture: state.get('picture'),
  }),
  mapObjectToState: async obj => Immutable.Map({
    email: obj.email,
    id: obj.userId,
    name: obj.name,
    firstName: obj.firstName,
    lastName: obj.lastName,
    picture: obj.picture,
  }),
}) {
}

export class UserWeeklyUsageProxy extends ListProxyMixin({
  model: UserWeeklyUsage,
  mapStateToArray: async state => {
    const l = [];
    let i = 0;
    for (const elt of state) {
      l.push({
        timestamp: elt,
        order: i,
      });
      i += 1;
    }
    return l;
  },
  mapArrayToState: async obj => Immutable.List(obj).map((elt: any) => elt.timestamp) as Immutable.List<any>,
  orderBy: 'order',
}) {
}

export class OnboardingProxy extends SingletonProxyMixin({
  model: Onboarding,
  mapStateToObject: async state => ({
    done: state.get('done'),
    appStoreTooltipDisabled: state.get('appStoreTooltipDisabled'),
    sleepNotification: state.get('sleepNotification'),
    lastInvitationColleagueDate: state.get('lastInvitationColleagueDate'),
  }),
  mapObjectToState: async obj => Immutable.Map({
    done: obj.done,
    appStoreTooltipDisabled: obj.appStoreTooltipDisabled,
    sleepNotification: obj.sleepNotification,
    lastInvitationColleagueDate: obj.lastInvitationColleagueDate,
  }),
}) {
}

export class DockProxy extends ListProxyMixin({
  model: Dock,
  mapStateToArray: async state => {
    const l = [];
    let i = 0;
    for (const elt of state) {
      l.push({
        applicationId: elt,
        order: i,
      });
      i += 1;
    }
    return l;
  },
  mapArrayToState: async obj => Immutable.List(obj).map((elt: any) => elt.applicationId) as Immutable.List<any>,
  orderBy: 'order',
}) {
}

export class SubwindowProxy extends ListProxyMixin({
  model: Subwindow,
  mapStateToArray: async state => {
    const l = [];
    for (const elt of state) {
      l.push({
        tabId: elt,
      });
    }
    return l;
  },
  mapArrayToState: async obj => Immutable.Set(obj).map((elt: any) => elt.tabId) as Immutable.List<any>,
}) {
}

const favoriteProxy = new MapStateProxy(FavoriteProxy);

export class ApplicationSettingsProxy extends MapProxyMixin({
  model: ApplicationSettings,
  key: 'manifestURL',
  mapStateToObject: async state => ({
    manifestURL: state.get('manifestURL'),
    doNotInstall: state.get('doNotInstall'),
    alwaysLoaded: state.get('alwaysLoaded'),
    instanceLogoInDock: state.get('instanceLogoInDock'),
  }),
  mapObjectToState: async obj => Immutable.Map({
    manifestURL: obj.manifestURL,
    doNotInstall: obj.doNotInstall,
    alwaysLoaded: obj.alwaysLoaded,
    instanceLogoInDock: obj.instanceLogoInDock,
  }),
}) {
}

export class TabsSubdockOrderProxy extends MapProxyMixin({
  model: TabsSubdockOrder,
  key: 'applicationId',
  mapStateToObject: async state => ({
    applicationId: state.get('applicationId'),
    stringifiedOrder: JSON.stringify(state.get('order', []).toArray()),
  }),
  mapObjectToState: async obj => Immutable.Map({
    applicationId: obj.applicationId,
    order: Immutable.List(JSON.parse(obj.stringifiedOrder)),
  }),
}) {
}

export class FavoritesSubdockOrderProxy extends MapProxyMixin({
  model: FavoritesSubdockOrder,
  key: 'applicationId',
  mapStateToObject: async state => ({
    applicationId: state.get('applicationId'),
    stringifiedOrder: JSON.stringify(state.get('order', []).toArray()),
  }),
  mapObjectToState: async obj => Immutable.Map({
    applicationId: obj.applicationId,
    order: Immutable.List(JSON.parse(obj.stringifiedOrder)),
  }),
}) {
}

export default function getBackend() {
  return {
    app: new SingletonStateProxy(AppProxy),
    applications: new MapStateProxy(ApplicationProxy),
    nav: new SingletonStateProxy(NavProxy),
    userIdentities: new MapStateProxy(IdentityProxy),
    user: new SingletonStateProxy(UserProxy),
    userWeeklyUsage: new ListStateProxy(UserWeeklyUsageProxy),
    dock: new ListStateProxy(DockProxy),
    favorites: <StateProxy<Immutable.Map<string, any>>>{
      get: async () => Immutable.Map({
        favorites: await favoriteProxy.get(),
      }),
      set: async (state: Immutable.Map<string, any>) => favoriteProxy.set(state.get('favorites')),
    },
    onboarding: new SingletonStateProxy(OnboardingProxy),
    tabs: new MapStateProxy(TabProxy),
    subwindows: new ListStateProxy(SubwindowProxy),
    servicesData: new KeyValueStateProxy(ServicesDataProxyMixin),
    ui: getUIProxy(models),
    passwordManagers: getPasswordManagers(),
    passwordManagerLinks: getPasswordManagerLinks(models),
    applicationSettings: new MapStateProxy(ApplicationSettingsProxy),
    orderedTabs: new MapStateProxy(TabsSubdockOrderProxy),
    orderedFavorites: new MapStateProxy(FavoritesSubdockOrderProxy),
  };
}
