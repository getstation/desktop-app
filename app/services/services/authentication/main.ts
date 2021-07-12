import { BrowserWindow, shell } from 'electron';
import * as http from 'http';
import * as url from 'url';
import { RPC } from '../../lib/types';
import { AuthenticationService } from './interface';
import OAuthPKCE from './oauthPKCE';
import { OAuthPKCEConfig, OAuthResponseBody } from './types';

/**
 * ⚠️ Not used anymore, it was used for auth0 authentication in the application
 *
 * The local port on which we'll be listening for the redirection.
 * @see https://tools.ietf.org/html/rfc8252#section-7.3
 *
 * This port is supposed to be chosen randomly, but Auth0 does
 * not support wildcard port number for the redirection URL. So
 * I chose a fixed but exotic port number.
 * @see https://community.auth0.com/t/random-local-ports-on-redirect-uri/28623/8
 */
const LOOPBACK_INTERFACE_REDIRECTION_PORT = 42813;

const AUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID;
const AUTH_AUDIENCE = process.env.AUTH_AUDIENCE;
const STATION_API_AUTHPROXY_ENDPOINT = process.env.STATION_API_AUTHPROXY_ENDPOINT!;

export class AuthenticationServiceImpl extends AuthenticationService implements RPC.Interface<AuthenticationService> {

  protected config: OAuthPKCEConfig;
  protected authService: OAuthPKCE;

  /**
   * A reference to the currently running `LoopbackRedirectServer`.
   */
  protected server: LoopbackRedirectServer | null;

  constructor(uuid?: string) {
    super(uuid);
    this.config = {
      clientId: AUTH_CLIENT_ID,
      authorizeEndpoint: `${STATION_API_AUTHPROXY_ENDPOINT}/authorize`,
      // To simulate an error, just remove openid from scope, and call userInfo
      scope: 'openid email given_name profile offline_access',
      redirectUri: `http://127.0.0.1:${LOOPBACK_INTERFACE_REDIRECTION_PORT}/callback`,
      tokenEndpoint: `${STATION_API_AUTHPROXY_ENDPOINT}/oauth/token`,
      // make requests OIDC compliant
      // @see https://auth0.com/docs/tokens/refresh-token/current
      audience: AUTH_AUDIENCE,
    };
    this.authService = new OAuthPKCE(this.config);
    this.server = null;
  }

  /**
   * Start Login flow
   * @returns {Promise<OAuthResponseBody>}
   */
  login() {
    return this.triggerNewAuthorizationFlow(this.authService.generateAuthUrl());
  }

  /**
   * Refresh token if refreshToken is provided otherwise retrigger login flow.
   * @returns {Promise<OAuthResponseBody>}
   */
  renew(refreshToken?: string) {
    if (refreshToken) {
      return this.authService.refreshToken(refreshToken);
    }
    return this.triggerNewAuthorizationFlow(this.authService.generateAuthUrl(true));
  }

  protected async triggerNewAuthorizationFlow(urlToLoad: string, silent: boolean = false): Promise<OAuthResponseBody> {
    if (this.server) {
      // if a server is already running, we close it so that we free the port
      // and restart the process
      await this.server.close();
      this.server = null;
    }
    this.server = new LoopbackRedirectServer({
      port: LOOPBACK_INTERFACE_REDIRECTION_PORT,
      callbackPath: '/callback',
      successRedirectURL: 'https://getstation.com/app-login-success/',
    });

    shell.openExternal(urlToLoad);

    const reachedCallbackURL = await this.server.waitForRedirection();

    // waitForRedirection will close the server
    this.server = null;

    // refocus on the window
    BrowserWindow.getAllWindows().filter(w => w.isVisible()).forEach(w => w.show());

    // exchange the Authorization code for a token
    const token = await this.authService.requestTokens(reachedCallbackURL);
    return token;
  }
}

type LoopbackRedirectServerOptions = {
  /**
   * The port the loopback will be listening on.
   */
  port: number,
  /**
   * The `path` on which we expect the code to be present
   * as query string.
   */
  callbackPath: string,
  /**
   * The URL to which the `callbackPath` will be redirecting to in case of sucess.
   */
  successRedirectURL: string,
};
class LoopbackRedirectServer {
  private _server: http.Server;
  private _maybeRedirection: Promise<string>;

  constructor({ port, successRedirectURL, callbackPath }: LoopbackRedirectServerOptions) {
    this._maybeRedirection = new Promise((resolve, reject) => {
      this._server = http.createServer((req, res) => {
        if (req.url && url.parse(req.url).pathname === callbackPath) {
          res.writeHead(302, {
            Location: successRedirectURL,
          });
          res.end();

          resolve(url.resolve(`http://127.0.0.1:${port}`, req.url));

          this._server.close();
        } else {
          res.writeHead(404);
          res.end();
        }
      });
      this._server.on('error', e => reject(e));
      this._server.listen(port);
    });
  }

  /**
   * Will resolve with the exact reached callback URL that contains the Authorization code.
   */
  waitForRedirection() {
    return this._maybeRedirection;
  }

  close() {
    return new Promise(resolve => this._server.close(resolve));
  }
}
