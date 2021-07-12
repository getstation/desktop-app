// @ts-ignore: no declaration file
import { combineReducers } from 'redux-immutable';
import { reducer as reduxUI } from 'redux-ui';
import app from '../app/duck';
import applicationSettings from '../application-settings/duck';
import applications from '../applications/duck';
import auto_update from '../auto-update/duck';
import bang from '../bang/duck';
import chromeExtensions from '../chrome-extensions/duck';
import dialogs from '../dialogs/duck';
import dlToaster from '../dl-toaster/duck';
import dock from '../dock/duck';
import downloads from '../downloads/duck';
import favorites from '../favorites/duck';
import history from '../history/duck';
import inTabSearch from '../in-tab-search/duck';
import nav from '../nav/duck';
import notificationCenter from '../notification-center/duck';
import notifications from '../notifications/duck';
import onboarding from '../onboarding/duck';
import {
  passwordManagerLinksReducer as passwordManagerLinks,
  passwordManagersReducers as passwordManagers,
} from '../password-managers/duck';
import plugins, { serviceDataReducer } from '../plugins/duck';
import subdock from '../subdock/duck';
import subwindows from '../subwindows/duck';
import tabWebcontents from '../tab-webcontents/duck';
import tabs from '../tabs/duck';
import orderedTabs from '../ordered-tabs/duck';
import orderedFavorites from '../ordered-favorites/duck';
import theme from '../theme/duck';
import ui from '../ui/duck';
import userActivities from '../user-activities/duck';
import userIdentities from '../user-identities/duck';
import windows from '../windows/duck';
import { combineAll } from './api';

const rootReducer = combineReducers({
  app,
  applications,
  tabs,
  orderedTabs,
  orderedFavorites,
  nav,
  dock,
  downloads,
  dialogs,
  dlToaster,
  auto_update,
  onboarding,
  userIdentities,
  favorites,
  bang,
  history,
  notifications,
  notificationCenter,
  tabWebcontents,
  inTabSearch,
  subdock,
  subwindows,
  windows,
  theme,
  userActivities,
  ui: combineAll([reduxUI, ui]),
  passwordManagers,
  passwordManagerLinks,
  servicesData: serviceDataReducer,
  applicationSettings,
  plugins,
  chromeExtensions,
});

export default rootReducer;
