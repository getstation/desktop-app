import * as Immutable from 'immutable';

// Constants
export type FIN = 'browserX/plugins/FIN';
export const FIN = 'browserX/plugins/FIN';
export type ERROR = 'browserX/plugins/ERROR';
export const ERROR = 'browserX/plugins/ERROR';
export type ACTIVATE_SERVICE = 'browserX/plugins/ACTIVATE_SERVICE';
export const ACTIVATE_SERVICE = 'browserX/plugins/ACTIVATE_SERVICE';
export type ACTIVATE_SERVICE_RENDERER = 'browserX/plugins/ACTIVATE_SERVICE_RENDERER';
export const ACTIVATE_SERVICE_RENDERER = 'browserX/plugins/ACTIVATE_SERVICE_RENDERER';
export type SET_SERVICE_DATA_VALUE = 'browserX/plugins/SET_SERVICE_DATA_VALUE';
export const SET_SERVICE_DATA_VALUE = 'browserX/plugins/SET_SERVICE_DATA_VALUE';
export type SET_SERVICE_DATA_VALUE_METADATA = 'browserX/plugins/SET_SERVICE_DATA_VALUE_METADATA';
export const SET_SERVICE_DATA_VALUE_METADATA = 'browserX/plugins/SET_SERVICE_DATA_VALUE_METADATA';

// Types
export type PluginValueMedata = {
  origin: string,
};

// Action Types
export type FinAction = { type: FIN, id: any };
export type ErrorAction = { type: ERROR, id: any };
export type ActivateServiceAction = { type: ACTIVATE_SERVICE, manifestURL: string };
export type ActivateServiceRendererAction = { type: ACTIVATE_SERVICE_RENDERER, manifestURL: string, serviceId: string };
export type SetServiceDataValueAction = {
  type: SET_SERVICE_DATA_VALUE,
  serviceId: string, key: string, value: any,
};
export type SetServiceDataValueMetadataAction = {
  type: SET_SERVICE_DATA_VALUE_METADATA,
  serviceId: string, key: string, metadata: PluginValueMedata,
};
export type PluginsActions =
  FinAction |
  ErrorAction |
  ActivateServiceAction |
  ActivateServiceRendererAction;

export type ServiceDataActions =
  SetServiceDataValueAction |
  SetServiceDataValueMetadataAction;

// Action creators
export const fin = (id: any): FinAction => ({
  type: FIN, id,
});
export const error = (id: any): ErrorAction => ({
  type: ERROR, id,
});
export const activateService = (manifestURL: string): ActivateServiceAction => ({
  type: ACTIVATE_SERVICE, manifestURL,
});
/**
 * @deprecated
 */
export const activateServiceRenderer = (manifestURL: string, serviceId: string): ActivateServiceRendererAction => ({
  type: ACTIVATE_SERVICE_RENDERER, manifestURL, serviceId,
});
export const setServiceDataValue = (serviceId: string, key: string, value: any): SetServiceDataValueAction => ({
  type: SET_SERVICE_DATA_VALUE, serviceId, key, value,
});
export const setServiceDataValueMetadata =
  (serviceId: string, key: string, metadata: PluginValueMedata): SetServiceDataValueMetadataAction => ({
    type: SET_SERVICE_DATA_VALUE_METADATA, serviceId, key, metadata,
  });

export default function plugin(state: Immutable.Map<string, any> = Immutable.Map(), action: PluginsActions) {
  switch (action.type) {
    case ACTIVATE_SERVICE: {
      const { manifestURL } = action;
      return state.setIn([manifestURL, 'id'], manifestURL);
    }

    case ACTIVATE_SERVICE_RENDERER: {
      const { manifestURL, serviceId } = action;
      return state.setIn([manifestURL, 'serviceId'], serviceId);
    }

    default:
      return state;
  }
}

export function serviceDataReducer(state: Immutable.Map<string, any> = Immutable.Map(), action: ServiceDataActions) {
  switch (action.type) {
    case SET_SERVICE_DATA_VALUE: {
      const { serviceId, key, value } = action;
      return state.setIn([serviceId, key], Immutable.fromJS(value));
    }

    case SET_SERVICE_DATA_VALUE_METADATA: {
      const { serviceId, key, metadata } = action;
      return state.setIn([serviceId, '__metadata', key], Immutable.fromJS(metadata));
    }

    default:
      return state;
  }
}
