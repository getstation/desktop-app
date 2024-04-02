import { Consumer } from '../common';

export namespace session {

  export interface SessionConsumer extends Consumer {
    readonly id: string;
    /**
     * Get Station User Agent
     * @example
     * const userAgent = await sdk.session.getUserAgent();
     */
    getUserAgent(): string;
    /**
     * List all cookies corresponding to the current service
     * @example
     * const cookies = await sdk.session.getCookies();
     */
    getCookies(): Promise<Cookie[]>;
    setProviderInterface(providerInterface: session.SessionProviderInterface): void
  }

  export interface SessionProviderInterface {
    getUserAgent(): string;
    getCookies(id: string): Promise<Cookie[]>;
  }

  export type Cookie = {
    // Docs: http://electron.atom.io/docs/api/structures/cookie

    /**
     * The domain of the cookie.
     */
    domain?: string;
    /**
     * The expiration date of the cookie as the number of seconds since the UNIX epoch.
     * Not provided for session cookies.
     */
    expirationDate?: number;
    /**
     * Whether the cookie is a host-only cookie.
     */
    hostOnly?: boolean;
    /**
     * Whether the cookie is marked as HTTP only.
     */
    httpOnly?: boolean;
    /**
     * The name of the cookie.
     */
    name: string;
    /**
     * The path of the cookie.
     */
    path?: string;
    /**
     * Whether the cookie is marked as secure.
     */
    secure?: boolean;
    /**
     * Whether the cookie is a session cookie or a persistent cookie with an expiration
     * date.
     */
    session?: boolean;
    /**
     * The value of the cookie.
     */
    value: string;
  };
}
