import { Credentials } from 'google-auth-library/build/src/auth/credentials';

export type Tokens = {
  [key: string]: Credentials & { expired?: boolean },
};

export type State = {
  tokens: Tokens,
};

export type UpdateTokensAction = {
  type: 'UPDATE_TOKENS'
  tokens: Tokens,
};

export type RemoveTokensAction = {
  type: 'REMOVE_TOKENS'
  key: string,
};

export type RequestAddTokensAction = {
  type: 'REQUEST_ADD_TOKENS',
};
