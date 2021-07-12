import { Action } from '@src/utils';

// Types
export enum Steps {
  NotVisible = 'not-visible',
  AppName = 'basic-info-form',
  Disambiguation = 'disambiguation-form',
  AppData = 'logo-url-form',
  Confirmation = 'confirmation-message',
  Exit = 'exit',
  LegacyBxApiApp = 'legacy-bx-api-app-modal',
}

export enum Visibility {
  Private = 'USER_EMAIL',
  Public = 'PUBLIC',
}

export type AppRequestData = {
  name: string,
  themeColor: string,
  logoURL: string,
  signinURL: string,
  scope: string,
  visibility: Visibility,
};

export enum ApiResponse {
  Error,
  Pending,
  Done,
}

export type ApplicationCreated = {
  id: string,
  bxAppManifestURL: string,
};

// State
export type AppRequest = {
  apiResponse?: ApiResponse,
  applicationCreated?: ApplicationCreated,
};

const defaultState: AppRequest = {
  apiResponse: undefined,
  applicationCreated: undefined,
};

// Constants
export const SUBMIT_APP_REQUEST = '@@appstore/app-request/SUBMIT_APP_REQUEST';
export type SUBMIT_APP_REQUEST = typeof SUBMIT_APP_REQUEST;

export const API_RESPONSE = '@@appstore/app-request/API_RESPONSE';
export type API_RESPONSE = typeof API_RESPONSE;

export const APPLICATION_CREATED = '@@appstore/app-request/APPLICATION_CREATED';
export type APPLICATION_CREATED = typeof APPLICATION_CREATED;

// Action Types
export type SubmitAppRequestAction = Action<SUBMIT_APP_REQUEST, AppRequestData>;

export type ApiResponseAction = Action<API_RESPONSE, { response: ApiResponse }>;

export type ApplicationCreatedAction = Action<APPLICATION_CREATED, { applicationCreated: ApplicationCreated }>;

export type AppRequestActions =
  SubmitAppRequestAction |
  ApiResponseAction |
  ApplicationCreatedAction;

// Action Creators
export const submitAppRequest = (request: AppRequestData): SubmitAppRequestAction => ({
  type: SUBMIT_APP_REQUEST,
  ...request,
});

export const setApiResponse = (response: ApiResponse): ApiResponseAction => ({
  type: API_RESPONSE,
  response,
});

export const setApplicationCreated = (applicationCreated: ApplicationCreated): ApplicationCreatedAction => ({
  type: APPLICATION_CREATED,
  applicationCreated,
});

// Reducer
export default function reducer(state: AppRequest = defaultState, action: AppRequestActions) {
  switch (action.type) {
    case SUBMIT_APP_REQUEST: {
      return state;
    }
    case API_RESPONSE: {
      const { response } = action;
      return { ...state, apiResponse: response };
    }
    case APPLICATION_CREATED: {
      const { applicationCreated } = action;
      return { ...state, applicationCreated };
    }
    default:
      return state;
  }
}
