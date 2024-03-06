export type OAuthPKCEConfig = {
  authorizeEndpoint: string,
  clientId: string,
  audience?: string,
  scope: string,
  redirectUri: string,
  tokenEndpoint: string,
  connection?: string,
};

export type ChallengePair = {
  verifier: string,
  challenge: string,
};

export type OAuthResponseBody = {
  error?: string,
  access_token?: string,
  id_token: string,
  scope?: string,
  expires_in?: number,
  token_type?: string,
  refresh_token?: string,
};

export type JWTIdToken = {
  nickname?: boolean,
  name?: string,
  picture?: string,
  updated_at?: string,
  email?: string,
  email_verified?: string,
  iss: string,
  sub: string,
  aud: string,
  iat: string,
  exp: string,
  // Properties added by Auth0 Rules.
  // namespacing custom properties is mandatory, so that's why it's not just `identities`
  ['https://getstation.com/identities']: {
    user_id: string,
    provider: string,
    connection: string,
    isSocial: boolean,
    [K: string]: any,
  }[],
};
