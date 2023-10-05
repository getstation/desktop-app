import * as Immutable from 'immutable';
import * as shortid from 'shortid';
import {
  RequestForApplicationNotifications,
  RequestForApplicationNotificationsStep,
} from '../notifications/duck';
import { Targets } from '../urlrouter/constants';
import { InstallContext } from './types';

/**
 * -------------
 * - PERSISTED -
 * -------------
 */

// Constants
export const CREATE_APPLICATION = 'browserX/applications/CREATE_APPLICATION';
export type CREATE_APPLICATION = 'browserX/applications/CREATE_APPLICATION';
export const DROP_APPLICATION = 'browserX/applications/DROP_APPLICATION';
export type DROP_APPLICATION = 'browserX/applications/DROP_APPLICATION';
export const RESET_APPLICATION = 'browserX/applications/RESET_APPLICATION';
export type RESET_APPLICATION = 'browserX/applications/RESET_APPLICATION';
export const SET_ACTIVE_TAB = 'browserX/applications/SET_ACTIVE_TAB';
export type SET_ACTIVE_TAB = 'browserX/applications/SET_ACTIVE_TAB';
export const ZOOM_IN = 'browserX/applications/ZOOM_IN';
export type ZOOM_IN = 'browserX/applications/ZOOM_IN';
export const ZOOM_OUT = 'browserX/applications/ZOOM_OUT';
export type ZOOM_OUT = 'browserX/applications/ZOOM_OUT';
export const RESET_ZOOM = 'browserX/applications/RESET_ZOOM';
export type RESET_ZOOM = 'browserX/applications/RESET_ZOOM';
export const UPDATE_ICON = 'browserX/applications/UPDATE_ICON';
export type UPDATE_ICON = 'browserX/applications/UPDATE_ICON';
export const SET_CONFIG_DATA = 'browserX/applications/SET_CONFIG_DATA';
export type SET_CONFIG_DATA = 'browserX/applications/SET_CONFIG_DATA';
export const INSTALL_APPLICATION = 'browserX/applications/INSTALL_APPLICATION';
export type INSTALL_APPLICATION = 'browserX/applications/INSTALL_APPLICATION';
export const UNINSTALL_APPLICATION = 'browserX/applications/UNINSTALL_APPLICATION';
export type UNINSTALL_APPLICATION = 'browserX/applications/UNINSTALL_APPLICATION';
export const REMOTE_UPDATE_INSTALLED_APPLICATIONS = 'browserX/applications/REMOTE_UPDATE_INSTALLED_APPLICATIONS';
export type REMOTE_UPDATE_INSTALLED_APPLICATIONS = 'browserX/applications/REMOTE_UPDATE_INSTALLED_APPLICATIONS';
export const DISPATCH_URL = 'browserX/applications/DISPATCH_URL';
export type DISPATCH_URL = 'browserX/applications/DISPATCH_URL';
export const TOGGLE_NOTIFICATIONS = 'browserX/applications/TOGGLE_NOTIFICATIONS';
export type TOGGLE_NOTIFICATIONS = 'browserX/applications/TOGGLE_NOTIFICATIONS';
export const DISABLE_NOTIFICATIONS = 'browserX/applications/DISABLE_NOTIFICATIONS';
export type DISABLE_NOTIFICATIONS = 'browserX/applications/DISABLE_NOTIFICATIONS';
export const ENABLE_NOTIFICATIONS = 'browserX/applications/ENABLE_NOTIFICATIONS';
export type ENABLE_NOTIFICATIONS = 'browserX/applications/ENABLE_NOTIFICATIONS';
export const ASK_ENABLE_NOTIFICATIONS = 'browserX/notification-center/ASK_ENABLE_NOTIFICATIONS';
export type ASK_ENABLE_NOTIFICATIONS = 'browserX/notification-center/ASK_ENABLE_NOTIFICATIONS';
export const SET_HOME_TAB_AS_ACTIVE = 'browserX/applications/SET_HOME_TAB_AS_ACTIVE';
export type SET_HOME_TAB_AS_ACTIVE = 'browserX/applications/SET_HOME_TAB_AS_ACTIVE';
export const CREATE_NEW_EMPTY_TAB = 'browserX/applications/CREATE_NEW_EMPTY_TAB';
export type CREATE_NEW_EMPTY_TAB = 'browserX/applications/CREATE_NEW_EMPTY_TAB';
export const CREATE_NEW_TAB = 'browserX/applications/CREATE_NEW_TAB';
export type CREATE_NEW_TAB = 'browserX/applications/CREATE_NEW_TAB';
export const CHANGE_SELECTED_APP = 'browserX/applications/CHANGE_SELECTED_APP';
export type CHANGE_SELECTED_APP = 'browserX/applications/CHANGE_SELECTED_APP';
export const NAVIGATE_TO_TAB = 'browserX/applications/NAVIGATE_TO_TAB';
export type NAVIGATE_TO_TAB = 'browserX/applications/NAVIGATE_TO_TAB';
export const NAVIGATE_TO_APPLICATION_TAB = 'browserX/applications/NAVIGATE_TO_APPLICATION_TAB';
export type NAVIGATE_TO_APPLICATION_TAB = 'browserX/applications/NAVIGATE_TO_APPLICATION_TAB';
export const NAVIGATE_TO_APPLICATION_TAB_AUTO = 'browserX/applications/NAVIGATE_TO_APPLICATION_TAB_AUTO';
export type NAVIGATE_TO_APPLICATION_TAB_AUTO = 'browserX/applications/NAVIGATE_TO_APPLICATION_TAB_AUTO';

export type ApplicationConfigData = { identityId?: string, subdomain?: string, customURL?: string };
export type ChangeSelectedAppVia = 'keyboard_shortcut_ctrl_num' | 'keyboard_shortcut_ctrl_alt_arrow' | 'mouse_click' |
  'settings-configure-account' | 'app-installation' | 'app-reset' | 'close-tab' | null;

// Action Types
export type CreateApplicationAction = {
  type: CREATE_APPLICATION,
  applicationId: string;
  manifestURL: string,
  installContext?: InstallContext,
  doNotNavigateTo: boolean,
};
export type DropApplicationAction = {
  type: DROP_APPLICATION,
  applicationId: string,
};
export type ResetApplicationAction = {
  type: RESET_APPLICATION,
  applicationId: string,
  via: string,
};
export type SetActiveTabAction = {
  type: SET_ACTIVE_TAB,
  applicationId: string,
  tabId: string,
  silent: boolean,
};
export type ZoomInAction = {
  type: ZOOM_IN,
  applicationId: string,
};
export type ZoomOutAction = {
  type: ZOOM_OUT,
  applicationId: string,
};
export type ResetZoomAction = {
  type: RESET_ZOOM,
  applicationId: string,
};
export type UpdateIconAction = {
  type: UPDATE_ICON,
  applicationId: string, imageURL: string,
};
export type SetConfigDataAction = {
  type: SET_CONFIG_DATA,
  applicationId: string,
  configData: ApplicationConfigData,
};
export type InstallApplicationAction = {
  type: INSTALL_APPLICATION,
  manifestURL: string,
  configData?: ApplicationConfigData,
  navigate?: boolean,
  optOutFlow?: boolean,
  installContext?: InstallContext,
  andCreateTabWithURL?: string,
};

export type UninstallApplicationAction = {
  type: UNINSTALL_APPLICATION,
  applicationId: string,
};
export type RemoteUpdateInstalledApplicationsAction = {
  type: REMOTE_UPDATE_INSTALLED_APPLICATIONS,
};
export type DispatchURLAction = {
  type: DISPATCH_URL,
  url: string, 
  origin?: { 
    tabId?: string, 
    applicationId?: string 
  }, 
  options?: { 
    target?: Targets, 
    loadInBackground?: boolean,
  },
};
export type ToggleNotificationsAction = {
  type: TOGGLE_NOTIFICATIONS, applicationId: string,
};
export type DisableNotificationsAction = {
  type: DISABLE_NOTIFICATIONS, applicationId: string,
};
export type EnableNotificationsAction = {
  type: ENABLE_NOTIFICATIONS, applicationId: string,
};
export type AskEnableNotificationsAction = {
  type: ASK_ENABLE_NOTIFICATIONS,
  applicationId: string,
  tabId: string,
  notificationId: string,
  props: any,
  step: RequestForApplicationNotificationsStep,
};
export type SetHomeTabAsActiveAction = {
  type: SET_HOME_TAB_AS_ACTIVE,
  applicationId: string,
};
export type CreateNewEmptyTabAction = {
  type: CREATE_NEW_EMPTY_TAB,
  applicationId: string,
  home: boolean,
};
export type CreateNewTabAction = {
  type: CREATE_NEW_TAB,
  applicationId: string,
  url: string,
  detach: boolean,
  home: boolean,
  navigateToApplication: boolean,
};
export type ChangeSelectedAppAction = {
  type: CHANGE_SELECTED_APP,
  applicationId: string,
  via: ChangeSelectedAppVia,
  markAsActiveTab: boolean,
};
export type NavigateToTabAction = {
  type: NAVIGATE_TO_TAB,
  applicationId: string,
  tabId: string,
  silent: boolean,
};
export type NavigateToApplicationTabAction = {
  type: NAVIGATE_TO_APPLICATION_TAB,
  applicationId: string,
  tabId: string,
  silent: boolean,
  via: ChangeSelectedAppVia,
};
export type NavigateToApplicationTabAutoAction = {
  type: NAVIGATE_TO_APPLICATION_TAB_AUTO,
  tabId: string,
  silent: boolean,
  via: ChangeSelectedAppVia,
};

export type ZoomActions = ZoomInAction | ZoomOutAction | ResetZoomAction;
export type ApplicationActions =
  CreateApplicationAction |
  DropApplicationAction |
  ResetApplicationAction |
  SetActiveTabAction |
  ZoomInAction |
  ZoomOutAction |
  ResetZoomAction |
  UpdateIconAction |
  SetConfigDataAction |
  InstallApplicationAction |
  UninstallApplicationAction |
  ToggleNotificationsAction |
  DisableNotificationsAction |
  EnableNotificationsAction |
  AskEnableNotificationsAction;

// Action Creators
export const createApplication = (
  manifestURL: string,
  installContext?: InstallContext,
  doNotNavigateTo = false,
): CreateApplicationAction => {
  const applicationId = shortid.generate();

  return {
    type: CREATE_APPLICATION,
    applicationId,
    manifestURL,
    installContext,
    doNotNavigateTo,
  };
};

export const dropApplication = (applicationId: string): DropApplicationAction => ({
  type: DROP_APPLICATION, applicationId,
});
export const uninstallApplication = (applicationId: string): UninstallApplicationAction => ({
  type: UNINSTALL_APPLICATION, applicationId,
});
export const resetApplication = (applicationId: string, via: string): ResetApplicationAction => ({
  type: RESET_APPLICATION, applicationId, via,
});
export const setActiveTab = (applicationId: string, tabId: string, silent: boolean = false): SetActiveTabAction => ({
  type: SET_ACTIVE_TAB, applicationId, tabId, silent,
});
export const zoomIn = (applicationId: string): ZoomInAction => ({
  type: ZOOM_IN, applicationId,
});
export const zoomOut = (applicationId: string): ZoomOutAction => ({
  type: ZOOM_OUT, applicationId,
});
export const resetZoom = (applicationId: string): ResetZoomAction => ({
  type: RESET_ZOOM, applicationId,
});
export const updateApplicationIcon = (applicationId: string, imageURL: string): UpdateIconAction => ({
  type: UPDATE_ICON, applicationId, imageURL,
});
export const setConfigData = (applicationId: string, configData: ApplicationConfigData): SetConfigDataAction => ({
  type: SET_CONFIG_DATA, applicationId, configData,
});
export const setHomeTabAsActive = (applicationId: string): SetHomeTabAsActiveAction => ({
  type: SET_HOME_TAB_AS_ACTIVE, applicationId,
});
export const createNewEmptyTab = (applicationId: string, home: boolean = false): CreateNewEmptyTabAction => ({
  type: CREATE_NEW_EMPTY_TAB, applicationId, home,
});
type CreateNewTabOptions = {
  home?: boolean,
  detach?: boolean,
  /**
   * When true, we'll navigate to the application
   * directly after creating the tab.
   */
  navigateToApplication?: boolean,
};
export const createNewTab = (applicationId: string, url: string, options: CreateNewTabOptions = {}): CreateNewTabAction => {
  const {
    home = false,
    detach = false,
    navigateToApplication = false,
  } = options;
  return {
    type: CREATE_NEW_TAB,
    applicationId,
    url,
    detach,
    home,
    navigateToApplication,
  };
};

export const changeSelectedApp = (applicationId: string, via: ChangeSelectedAppVia = null, markAsActiveTab: boolean = true):
  ChangeSelectedAppAction => ({
    type: CHANGE_SELECTED_APP, applicationId, via, markAsActiveTab,
  });
export const navigateToTab = (applicationId: string, tabId: string, silent: boolean = false):
  NavigateToTabAction => ({
    type: NAVIGATE_TO_TAB, applicationId, tabId, silent,
  });
export const navigateToApplicationTab = (applicationId: string, tabId: string, via: ChangeSelectedAppVia = null, silent: boolean = false):
  NavigateToApplicationTabAction => ({
    type: NAVIGATE_TO_APPLICATION_TAB, applicationId, tabId, silent, via,
  });
export const navigateToApplicationTabAutomatically = (tabId: string, via: ChangeSelectedAppVia = null, silent: boolean = false):
  NavigateToApplicationTabAutoAction => ({
    type: NAVIGATE_TO_APPLICATION_TAB_AUTO, tabId, silent, via,
  });

interface InstallApplicationOptions {
  configData?: ApplicationConfigData,
  /**
  * Will make Station navigate to the application after installation.
  */
  navigate?: boolean,
  /**
   * Will instruct to create a new tab with this URL to the
   * installed application.
   */
  andCreateTabWithURL?: string,
  optOutFlow?: boolean,
  installContext?: InstallContext,
}

export const installApplication = (
  manifestURL: string,
  options: InstallApplicationOptions = {}
): InstallApplicationAction => ({
  type: INSTALL_APPLICATION,
  manifestURL,
  configData: options.configData,
  navigate: options.navigate,
  optOutFlow: options.optOutFlow,
  installContext: options.installContext,
  andCreateTabWithURL: options.andCreateTabWithURL,
});

export const remoteUpdateInstalledApplications = (): RemoteUpdateInstalledApplicationsAction => ({
  type: REMOTE_UPDATE_INSTALLED_APPLICATIONS,
});

export const dispatchUrl = (url: string, origin?: { tabId?: string, applicationId?: string }, options?: { target: Targets }):
  DispatchURLAction => ({
    type: DISPATCH_URL, url, origin, options,
  });

export const toggleNotifications = (applicationId: string): ToggleNotificationsAction => ({
  type: TOGGLE_NOTIFICATIONS, applicationId,
});

export const disableNotifications = (applicationId: string): DisableNotificationsAction => ({
  type: DISABLE_NOTIFICATIONS, applicationId,
});

export const enableNotifications = (applicationId: string): EnableNotificationsAction => ({
  type: ENABLE_NOTIFICATIONS, applicationId,
});

export const askEnableNotifications = ({ applicationId, tabId, notificationId, props, step }: RequestForApplicationNotifications):
  AskEnableNotificationsAction => ({
    type: ASK_ENABLE_NOTIFICATIONS, applicationId, tabId, notificationId, props, step,
  });

// Reducer
export default function applications(state: Immutable.Map<string, any> = Immutable.Map(), action: ApplicationActions) {
  switch (action.type) {

    case CREATE_APPLICATION: {
      const { applicationId, manifestURL, installContext } = action;

      return state.set(applicationId, Immutable.Map({
        applicationId,
        manifestURL,
        installContext: installContext ? Immutable.Map(installContext) : undefined,
      }));
    }

    case SET_CONFIG_DATA: {
      const { applicationId, configData: { identityId, subdomain, customURL } } = action;
      let newState = state;
      if (identityId) {
        newState = state.setIn([applicationId, 'identityId'], identityId);
      }
      if (subdomain) {
        newState = state.setIn([applicationId, 'subdomain'], subdomain);
      }
      if (customURL) {
        newState = state.setIn([applicationId, 'customURL'], customURL);
      }
      return newState;
    }

    case DROP_APPLICATION: {
      const { applicationId } = action;
      return state.remove(applicationId);
    }

    case SET_ACTIVE_TAB: {
      const { applicationId, tabId } = action;
      if (!state.has(applicationId)) return state;
      return state.setIn([applicationId, 'activeTab'], tabId);
    }

    case ZOOM_IN: {
      const { applicationId } = action;
      if (!state.has(applicationId)) return state;
      return state.updateIn([applicationId, 'zoomLevel'], 0, zoomLevel => zoomLevel + 0.5);
    }

    case ZOOM_OUT: {
      const { applicationId } = action;
      if (!state.has(applicationId)) return state;
      return state.updateIn([applicationId, 'zoomLevel'], 0, zoomLevel => zoomLevel - 0.5);
    }

    case RESET_ZOOM: {
      const { applicationId } = action;
      return state.setIn([applicationId, 'zoomLevel'], 0);
    }

    case UPDATE_ICON: {
      const { applicationId, imageURL } = action;
      if (!state.has(applicationId)) return state;
      return state.setIn([applicationId, 'iconURL'], imageURL);
    }

    case DISABLE_NOTIFICATIONS: {
      const { applicationId } = action;
      return state.setIn([applicationId, 'notificationsEnabled'], false);
    }

    case ENABLE_NOTIFICATIONS: {
      const { applicationId } = action;
      return state.setIn([applicationId, 'notificationsEnabled'], true);
    }

    case ASK_ENABLE_NOTIFICATIONS: {
      const { applicationId, tabId, notificationId, props, step } = action;
      if (step === RequestForApplicationNotificationsStep.FINISH) {
        return state.deleteIn([applicationId, 'askEnableNotification']);
      }
      return state.setIn([applicationId, 'askEnableNotification'],
        Immutable.fromJS({ applicationId, tabId, notificationId, props, step }));
    }

    default:
      return state;
  }
}
