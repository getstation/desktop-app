// Constants
export type OPEN_APPLICATION_PREFERENCES = 'browserX/app-preferences/OPEN_APPLICATION_PREFERENCES';
export const OPEN_APPLICATION_PREFERENCES = 'browserX/app-preferences/OPEN_APPLICATION_PREFERENCES';

export type OpenApplicationPreferencesViaType = 'menu' | 'app-subdock' | 'appstore';

export enum OpenApplicationPreferencesVia {
  MENU = 'menu',
  APP_SUBDOCK = 'app-subdock',
  APPSTORE = 'appstore',
}

// Action Types
export type OpenApplicationPreferencesAction = {
  type: OPEN_APPLICATION_PREFERENCES,
  manifestURL: string,
  via: OpenApplicationPreferencesVia,
};

// Action creators

/**
 * Should be called to open the "My Apps" settings tab, and scroll to the corresponding application or extension
 * @param manifestURL manifestURL associated to the application or extension
 */
export const openApplicationPreferences = (
  manifestURL: string,
  via: OpenApplicationPreferencesViaType,
): OpenApplicationPreferencesAction => ({
  type: OPEN_APPLICATION_PREFERENCES,
  via,
  manifestURL,
});
