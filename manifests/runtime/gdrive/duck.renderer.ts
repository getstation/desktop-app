import { State, Tokens } from './types';

// Actions
export const UPDATE_TOKENS = 'gdrive/UPDATE_TOKENS';
export type UPDATE_TOKENS = typeof UPDATE_TOKENS;
export const REMOVE_TOKEN = 'gdrive/REMOVE_TOKEN';
export type REMOVE_TOKEN = typeof REMOVE_TOKEN;
export const REQUEST_ADD_TOKEN = 'gdrive/REQUEST_ADD_TOKEN';
export type REQUEST_ADD_TOKEN = typeof REQUEST_ADD_TOKEN;

// Action Types
export type UpdateTokensAction = { type: UPDATE_TOKENS, payload: Tokens };
export type RemoveTokenAction = { type: REMOVE_TOKEN, payload: string };
export type RequestAddTokenAction = { type: REQUEST_ADD_TOKEN };
export type Actions = UpdateTokensAction | RemoveTokenAction | RequestAddTokenAction;

// Actions creators
export const updateAccounts = (payload: Tokens): UpdateTokensAction => ({
  type: UPDATE_TOKENS, payload,
});

export const removeToken = (key: string): RemoveTokenAction => {
  return {
    type: REMOVE_TOKEN, payload: key,
  };
};

export const requestAddToken = (): RequestAddTokenAction => {
  return {
    type: REQUEST_ADD_TOKEN,
  };
};

// Reducer
const initialState: State = {
  tokens: {},
};
export default function reducer(state: State = initialState, action: Actions) {
  switch (action.type) {
    case UPDATE_TOKENS:
      return {
        ...state,
        tokens: action.payload,
      };

    default:
      return state;
  }
}
