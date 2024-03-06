import {
  SDK,
  session,
} from '@getstation/sdk';
import memoizee = require('memoizee');

const requiredCookiesForAuthenticatedUser = ['token_v2', 'userId'];

const optsForMemoizedCookies: memoizee.Options = {
  maxAge: 10000,
  promise: true,
  preFetch: true,
};

export const isLogged = memoizee(
  async (sdk: SDK) =>
    (await cookies(sdk)).map(c => c.name)
      .includes(requiredCookiesForAuthenticatedUser[0]),
  optsForMemoizedCookies
);

export const authCookies = memoizee(
  async (sdk: SDK) =>
    (await cookies(sdk))
      .filter(c => requiredCookiesForAuthenticatedUser.includes(c.name))
      .map(c => `${c.name}=${c.value};`)
      .join(' '),
  optsForMemoizedCookies
);

const cookies = memoizee(
  async (sdk: SDK): Promise<session.Cookie[]> =>
    await sdk.session.getCookies(),
  optsForMemoizedCookies
);
