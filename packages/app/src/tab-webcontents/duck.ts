import * as Immutable from 'immutable';
import { hasWebcontentsId } from './selectors';

// Actions
export const NEW_WEBCONTENTS_ATTACHED_TO_TAB = 'browserX/tabWebcontents/NEW_WEBCONTENTS_ATTACHED_TO_TAB';
export type NEW_WEBCONTENTS_ATTACHED_TO_TAB = 'browserX/tabWebcontents/NEW_WEBCONTENTS_ATTACHED_TO_TAB';
export const ATTACH_WEBCONTENTS_TO_TAB = 'browserX/tabWebcontents/ATTACH_WEBCONTENTS_TO_TAB';
export type ATTACH_WEBCONTENTS_TO_TAB = 'browserX/tabWebcontents/ATTACH_WEBCONTENTS_TO_TAB';
export const SET_WAITING_TO_ATTACH = 'browserX/tabWebcontents/SET_WAITING_TO_ATTACH';
export type SET_WAITING_TO_ATTACH = 'browserX/tabWebcontents/SET_WAITING_TO_ATTACH';
export const SET_DETACHING = 'browserX/tabWebcontents/SET_DETACHING';
export type SET_DETACHING = 'browserX/tabWebcontents/SET_DETACHING';
export const SET_LOADING_ERROR = 'browserX/tabWebcontents/SET_LOADING_ERROR';
export type SET_LOADING_ERROR = 'browserX/tabWebcontents/SET_LOADING_ERROR';
export const SET_CRASHED = 'browserX/tabWebcontents/SET_CRASHED';
export type SET_CRASHED = 'browserX/tabWebcontents/SET_CRASHED';
export const FRONT_ACTIVE_TAB_CHANGE = 'browserX/tabWebcontents/FRONT_ACTIVE_TAB_CHANGE';
export type FRONT_ACTIVE_TAB_CHANGE = 'browserX/tabWebcontents/FRONT_ACTIVE_TAB_CHANGE';
export const EXECUTE_WEBVIEW_METHOD = 'browserX/tabs/EXECUTE_WEBVIEW_METHOD';
export type EXECUTE_WEBVIEW_METHOD = 'browserX/tabs/EXECUTE_WEBVIEW_METHOD';
export const EXECUTE_WEBVIEW_METHOD_FOR_CURRENT_TAB = 'browserX/tabWebcontents/EXECUTE_WEBVIEW_METHOD_FOR_CURRENT_TAB';
export type EXECUTE_WEBVIEW_METHOD_FOR_CURRENT_TAB = 'browserX/tabWebcontents/EXECUTE_WEBVIEW_METHOD_FOR_CURRENT_TAB';
export const NAVIGATE_TAB_TO_URL = 'browserX/tabWebcontents/NAVIGATE_TAB_TO_URL';
export type NAVIGATE_TAB_TO_URL = 'browserX/tabWebcontents/NAVIGATE_TAB_TO_URL';
export const CHANGE_HASH_AND_NAVIGATE_TO_TAB = 'browserX/tabWebcontents/CHANGE_HASH_AND_NAVIGATE_TO_TAB';
export type CHANGE_HASH_AND_NAVIGATE_TO_TAB = 'browserX/tabWebcontents/CHANGE_HASH_AND_NAVIGATE_TO_TAB';
export const PROMPT_BASIC_AUTH = 'browserX/tabWebcontents/PROMPT_BASIC_AUTH';
export type PROMPT_BASIC_AUTH = 'browserX/tabWebcontents/PROMPT_BASIC_AUTH';
export const PERFORM_BASIC_AUTH = 'browserX/tabWebcontents/PERFORM_BASIC_AUTH';
export type PERFORM_BASIC_AUTH = 'browserX/tabWebcontents/PERFORM_BASIC_AUTH';
export const REMOVE_WEBCONTENTS = 'browserX/tabWebcontents/REMOVE_WEBCONTENTS';
export type REMOVE_WEBCONTENTS = 'browserX/tabWebcontents/REMOVE_WEBCONTENTS';
export const RACE_CLOSE = 'browserX/tabWebcontents/RACE_CLOSE';
export type RACE_CLOSE = 'browserX/tabWebcontents/RACE_CLOSE';
export const DOM_READY = 'browserX/tabWebcontents/DOM_READY';
export type DOM_READY = 'browserX/tabWebcontents/DOM_READY';

// Actions types
export type DoNothingAction = {
  type: 'DO_NOTHING',
};
export type NewWebcontentsAttachedToTabAction = {
  type: NEW_WEBCONTENTS_ATTACHED_TO_TAB,
  tabId: string,
  webcontentsId: number,
};
export type AttachWebcontentsToTabAction = {
  type: ATTACH_WEBCONTENTS_TO_TAB,
  tabId: string,
  webcontentsId: number,
  timestamp: number,
};
export type DoAttachAction = { type: SET_WAITING_TO_ATTACH, tabId: string };
export type SetDetachingAction = { type: SET_DETACHING, tabId: string };
export type SetLoadingErrorAction = {
  type: SET_LOADING_ERROR,
  tabId: string, errorCode?: number, errorDescription?: string,
};
export type SetCrashedAction = { type: SET_CRASHED, tabId: string, crashed: boolean };
export type FrontActiveTabChangeAction = { type: FRONT_ACTIVE_TAB_CHANGE, tabId: string, previousActiveTabId: string | null };
export type ExecuteWebviewMethodAction = { type: EXECUTE_WEBVIEW_METHOD, tabId: string, method: string };
export type ExecuteWebviewMethodForCurrentTabAction = { type: EXECUTE_WEBVIEW_METHOD_FOR_CURRENT_TAB, method: string };
export type NavigateTabToURLAction = { type: NAVIGATE_TAB_TO_URL, tabId: string, url: string };
export type ChangeHashAndNavigateToTabAction = { type: CHANGE_HASH_AND_NAVIGATE_TO_TAB, tabId: string, url: string };
export type PromptWebcontentsBasicAuthAction = {
  type: PROMPT_BASIC_AUTH,
  tabId: string, basicAuth: boolean, authInfo?: Electron.AuthInfo,
};
export type PerformBasicAuthAction = {
  type: PERFORM_BASIC_AUTH,
  username: string, password: string, tabId: string,
};
export type RemoveWebcontentsAction = { type: REMOVE_WEBCONTENTS, tabId: string };
export type CloseAfterReattachedOrTimeoutAction = { type: RACE_CLOSE, tabId: string };
export type DomReadyAction = { type: DOM_READY, webcontentsId: number, tabId: string };
export type WebcontentsActions =
  DoAttachAction
  | SetDetachingAction
  | AttachWebcontentsToTabAction
  | SetCrashedAction
  | SetLoadingErrorAction
  | ExecuteWebviewMethodAction
  | PromptWebcontentsBasicAuthAction
  | RemoveWebcontentsAction
  | DomReadyAction;

// Actions creators
export const newWebcontentsAttachedToTab = (tabId: string, webcontentsId: number): NewWebcontentsAttachedToTabAction => ({
  type: NEW_WEBCONTENTS_ATTACHED_TO_TAB, tabId, webcontentsId,
});

export const attachWebcontentsToTab = (tabId: string, webcontentsId: number, timestamp: number): AttachWebcontentsToTabAction => ({
  type: ATTACH_WEBCONTENTS_TO_TAB, tabId, webcontentsId, timestamp,
});

export const doAttach = (tabId: string): DoAttachAction => ({
  type: SET_WAITING_TO_ATTACH, tabId,
});

export const setDetaching = (tabId: string): SetDetachingAction => ({
  type: SET_DETACHING, tabId,
});

export const setLoadingError = (tabId: string, errorCode?: number, errorDescription?: string): SetLoadingErrorAction | DoNothingAction => {
  // since we play with URL loading, this error may happen:
  // that's not really an error, we can ignore it
  if (errorCode === -3) { // ABORTED
    return { type: 'DO_NOTHING' };
  }

  return {
    type: SET_LOADING_ERROR, tabId, errorCode, errorDescription,
  };
};

export const setCrashed = (tabId: string): SetCrashedAction => ({ type: SET_CRASHED, tabId, crashed: true });

export const setNotCrashed = (tabId: string): SetCrashedAction => ({ type: SET_CRASHED, tabId, crashed: false });

export const frontActiveTabChange = (
  tabId: string,
  previousActiveTabId: string | null,
): FrontActiveTabChangeAction => ({ type: FRONT_ACTIVE_TAB_CHANGE, tabId, previousActiveTabId });

export const executeWebviewMethod = (tabId: string, method: string): ExecuteWebviewMethodAction => {
  return { type: EXECUTE_WEBVIEW_METHOD, tabId, method };
};

export const executeWebviewMethodForCurrentTab = (method: string): ExecuteWebviewMethodForCurrentTabAction => {
  return { type: EXECUTE_WEBVIEW_METHOD_FOR_CURRENT_TAB, method };
};

export const changeHashAndNavigateToTab = (tabId: string, url: string): ChangeHashAndNavigateToTabAction =>
  ({ type: CHANGE_HASH_AND_NAVIGATE_TO_TAB, tabId, url });

export const navigateTabToURL = (tabId: string, url: string): NavigateTabToURLAction =>
  ({ type: NAVIGATE_TAB_TO_URL, tabId, url });

export const promptWebcontentsBasicAuth = (
  tabId: string,
  basicAuth: boolean,
  authInfo?: Electron.AuthInfo,
): PromptWebcontentsBasicAuthAction => ({
  type: PROMPT_BASIC_AUTH, tabId, basicAuth, authInfo,
});

export const performBasicAuth = (username: string, password: string, tabId: string): PerformBasicAuthAction => ({
  type: PERFORM_BASIC_AUTH, username, password, tabId,
});

export const removeWebcontents = (tabId: string): RemoveWebcontentsAction => ({
  type: REMOVE_WEBCONTENTS, tabId,
});

export const closeAfterReattachedOrTimeout = (tabId: string): CloseAfterReattachedOrTimeoutAction => ({
  type: RACE_CLOSE, tabId,
});

export const domReady = (webcontentsId: number, tabId: string): DomReadyAction => ({
  type: DOM_READY, webcontentsId, tabId,
});

export default function tabWebcontents(state: Immutable.Map<string, any> = Immutable.Map(), action: WebcontentsActions) {
  switch (action.type) {

    case ATTACH_WEBCONTENTS_TO_TAB: {
      return state.mergeIn([action.tabId], Immutable.Map({
        tabId: action.tabId,
        webcontentsId: action.webcontentsId,
        mountState: 'mounted',
        mountedAt: action.timestamp,
      }));
    }

    case SET_WAITING_TO_ATTACH: {
      const { tabId } = action;
      const twc = state.get(tabId);
      if (hasWebcontentsId(twc)) return state;
      return state.setIn([tabId, 'mountState'], 'waitingToAttach');
    }

    case SET_DETACHING: {
      const { tabId } = action;
      return state.setIn([tabId, 'mountState'], 'detaching');
    }

    case SET_CRASHED: {
      const twc = state.get(action.tabId);
      if (!twc) return state;
      return state.setIn([action.tabId, 'crashed'], action.crashed);
    }

    case SET_LOADING_ERROR: {
      const { tabId, errorCode, errorDescription } = action;
      return state
        .setIn([tabId, 'errorCode'], errorCode)
        .setIn([tabId, 'errorDescription'], errorDescription);
    }

    case PROMPT_BASIC_AUTH: {
      const { tabId, basicAuth, authInfo } = action;
      return state
        .setIn([tabId, 'basicAuth'], basicAuth)
        .setIn([tabId, 'basicAuthInfo'], Immutable.fromJS(authInfo));
    }

    case REMOVE_WEBCONTENTS: {
      const { tabId } = action;
      return state.remove(tabId);
    }

    default:
      return state;
  }
}
