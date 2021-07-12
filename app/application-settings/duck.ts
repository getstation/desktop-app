import * as Immutable from 'immutable';
import {
  ApplicationSettingsImmutable,
} from './types';

// Constants

export const SET_INSTALLABLE = 'browserX/application-settings/SET_INSTALLABLE';
export type SET_INSTALLABLE = typeof SET_INSTALLABLE;
export const SET_ALWAYS_LOADED = 'browserx/application-settings/SET_ALWAYS_LOADED';
export type SET_ALWAYS_LOADED = typeof SET_ALWAYS_LOADED;
export const SET_INSTANCE_LOGO_IN_DOCK = 'browserX/application-settings/SET_INSTANCE_LOGO_IN_DOCK';
export type SET_INSTANCE_LOGO_IN_DOCK = typeof SET_INSTANCE_LOGO_IN_DOCK;

// Action Types

export type MarkApplicationsWithManifestAsInstallableAction = { type: SET_INSTALLABLE, manifestURL: string, doNotInstall: boolean };
export type SetAlwaysLoadedAction = { type: SET_ALWAYS_LOADED, manifestURL: string, alwaysLoaded: boolean };
export type SetInstanceLogoInDockAction = { type: SET_INSTANCE_LOGO_IN_DOCK, manifestURL: string, instanceLogoInDock: boolean };

export type ApplicationsActions =
  MarkApplicationsWithManifestAsInstallableAction
  | SetAlwaysLoadedAction
  | SetInstanceLogoInDockAction;

// Action creators

export const markApplicationsWithManifestAsInstallable = (
  manifestURL: string,
  doNotInstall: boolean
): MarkApplicationsWithManifestAsInstallableAction => ({
  type: SET_INSTALLABLE, manifestURL, doNotInstall,
});

export const setAlwaysLoaded = (
  manifestURL: string,
  alwaysLoaded: boolean
): SetAlwaysLoadedAction => ({
  type: SET_ALWAYS_LOADED, manifestURL, alwaysLoaded,
});

export const setInstanceLogoInDock = (
  manifestURL: string,
  instanceLogoInDock: boolean
): SetInstanceLogoInDockAction => ({
  type: SET_INSTANCE_LOGO_IN_DOCK, manifestURL, instanceLogoInDock,
});

// Reducer

export default function applicationSettings(
  state: ApplicationSettingsImmutable = Immutable.Map() as ApplicationSettingsImmutable,
  action: ApplicationsActions,
): ApplicationSettingsImmutable {
  switch (action.type) {
    case SET_INSTALLABLE: {
      const { manifestURL, doNotInstall } = action;
      return state.mergeIn([manifestURL] as any, Immutable.Map({
        manifestURL,
        doNotInstall,
      }) as ApplicationSettingsImmutable);
    }

    case SET_ALWAYS_LOADED: {
      const { manifestURL, alwaysLoaded } = action;
      return state.mergeIn([manifestURL] as any, Immutable.Map({ manifestURL, alwaysLoaded }) as ApplicationSettingsImmutable);
    }

    case SET_INSTANCE_LOGO_IN_DOCK: {
      const { manifestURL, instanceLogoInDock } = action;
      return state.mergeIn([manifestURL] as any, Immutable.Map({ manifestURL, instanceLogoInDock }) as ApplicationSettingsImmutable);
    }

    default:
      return state;
  }
}
