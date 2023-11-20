import * as Immutable from 'immutable';
import createCachedSelector from 're-reselect';
import { StationState } from '../types';
import { ApplicationsSettingsImmutable } from './types';

export const getApplicationsSettings = (
  state: StationState
): ApplicationsSettingsImmutable =>
  state.get(
    'applicationSettings',
    Immutable.Map() as ApplicationsSettingsImmutable
  );

export const getIsApplicationInstanceLogoInDock = (
  state: StationState,
  manifestURL: string
): boolean =>
  getApplicationsSettings(state).getIn([manifestURL, 'instanceLogoInDock'], false);

export const isNotInstallableApplication = (state: StationState, manifestURL: string): boolean =>
  state.getIn(['applicationSettings', manifestURL, 'doNotInstall'], false);

export const getSettingsByManifestURL = createCachedSelector(
  getApplicationsSettings,
  (_state: StationState, manifestURL: string) => manifestURL,
  (applicationsSettings, manifestURL) => {
    const settings = applicationsSettings
      .valueSeq()
      .find(v => v.get('manifestURL') === manifestURL);

    if (settings) {
      return settings.toJS();
    }

    return {
      manifestURL,
      alwaysLoaded: false,
      doNotInstall: false,
      instanceLogoInDock: false,
    };
  }
)((_state: StationState, manifestURL: string) => manifestURL);
