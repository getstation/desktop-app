import * as crypto from 'crypto';
import { ParsedUrlQuery } from 'querystring';
import * as url from 'url';
import { ChallengePair, OAuthPKCEConfig, OAuthResponseBody } from './types';
import { getBody, jsonFetch } from './utils';

/**
 * This class handles basic OAuth calls and error checking.
 *
 * @see https://auth0.com/docs/api-auth/tutorials/authorization-code-grant-pkce
 */
export default class OAuthPKCE {

  challengePair: ChallengePair;
  config: OAuthPKCEConfig;

  constructor(config: OAuthPKCEConfig) {
    this.config = config;
    this.challengePair = OAuthPKCE.getPKCEChallengePair();
  }

  static getPKCEChallengePair(): ChallengePair {
    const verifier = OAuthPKCE.base64URLEncode(crypto.randomBytes(32));
    const challenge = OAuthPKCE.base64URLEncode(OAuthPKCE.sha256(verifier));
    return { verifier, challenge };
  }

  static base64URLEncode(str: Buffer): string {
    return str.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  static sha256(buffer: string): Buffer {
    return crypto.createHash('sha256').update(buffer).digest();
  }

  /**
   * Request tokens like accessToken and idToken
   * @param {string} callbackUrl
   * @returns {Promise<OAuthResponseBody>}
   */
  async requestTokens(callbackUrl: string): Promise<OAuthResponseBody> {
    const { query } = url.parse(callbackUrl, true);
    if (query.error) {
      throw new Error(query.error_description as string);
    } else if (query.code) {
      return this.requestTokensPKCE(query);
    }
    return this.requestTokensBasic(query);
  }

  refreshToken(refreshToken: string): Promise<OAuthResponseBody> {
    const options = this.getRefreshTokenPostRequest(refreshToken);
    return jsonFetch(this.config.tokenEndpoint, options);
  }

  /**
   * The return of this function will be loaded by a BrowserWindow or a webview to start login/renew flow
   * @param {boolean} silent
   * @returns {string}
   */
  generateAuthUrl(silent: boolean = false): string {
    const query: any = {
      response_type: 'code',
      scope: this.config.scope,
      client_id: this.config.clientId,
      code_challenge: this.challengePair.challenge,
      code_challenge_method: 'S256',
      redirect_uri: this.config.redirectUri,
    };
    if (this.config.audience) {
      query.audience = this.config.audience;
    }
    if (this.config.connection) {
      query.connection = this.config.connection;
    }
    if (silent) {
      query.prompt = 'none';
    }
    return url.format({
      host: this.config.authorizeEndpoint,
      query,
    });
  }

  protected requestTokensPKCE(query: ParsedUrlQuery): Promise<OAuthResponseBody> {
    const verifier = this.challengePair.verifier;
    const options = this.getTokenPostRequest(query.code as string, verifier);

    return jsonFetch(this.config.tokenEndpoint, options);
  }

  protected requestTokensBasic(query: ParsedUrlQuery): OAuthResponseBody {
    if (!query.id_token) throw new Error('Could not parse the Authorization code');

    return {
      id_token: query.id_token as string,
      refresh_token: query.refresh_token as string,
    };
  }

  protected getTokenPostRequest(authCode: string, verifier: string) {
    const body = {
      grant_type:'authorization_code',
      client_id: this.config.clientId,
      code_verifier: verifier,
      code: authCode,
      redirect_uri: this.config.redirectUri,
    };
    return getBody(body);
  }

  protected getRefreshTokenPostRequest(refreskToken: string) {
    const body = {
      grant_type:'refresh_token',
      client_id: this.config.clientId,
      refresh_token: refreskToken,
    };
    return getBody(body);
  }
}
