import { SDK, search } from '@getstation/sdk';
import { Credentials } from 'google-auth-library/build/src/auth/credentials';
import * as decode from 'jwt-decode';
import { compose, prop, reject } from 'ramda';
import { contained } from 'ramda-adjunct';
import { combineLatest, defer, from, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { startActivityRecording, stopActivityRecording } from '../common/activity';
import { idExtractor, resourceExtractor } from './activity';
import { ElectronGDriveOAuth2, getGDriveFilesAsSearchResults } from './helpers';
import { startHistoryRecording, stopHistoryRecording } from './history';
import { addResourcesHandler, removeResourcesHandler } from './resources';
import { RemoveTokensAction, Tokens, UpdateTokensAction } from './types';

// ----------------------------------------------------------------------
// ⚠️ Disabled for now, as it needs a custom GOOGLE_CLIENT_ID
// and GOOGLE_CLIENT_SECRET.
//
// Once a solution is found, put back the following in 16.json manifest:
//   "main": "gdrive/main",
//   "renderer": "gdrive/renderer",
// ----------------------------------------------------------------------

const allResultsObservable = new Set<Observable<search.SearchResultWrapper>>();
let updateResultsObservableSubscription: Subscription | null = null;
let subscriptions: Subscription[];

/**
 * Listen for search query updates to trigger GDrive search, and send back results
 * @param {SDK} sdk
 * @param {ElectronGDriveOAuth2} client
 * @param {string?} email
 * @returns {Observable<search.SearchResultWrapper>}
 */
function initBindQuery(sdk: SDK, client: ElectronGDriveOAuth2, email?: string): Observable<search.SearchResultWrapper> {
  let cancelRunningQuery: (() => void) | null = null;

  return defer<Observable<search.SearchResultWrapper>>(() => Observable.create(subscriber =>
    sdk.search.query
      .pipe(
        tap((query) => {
          if (cancelRunningQuery) {
            cancelRunningQuery();
            cancelRunningQuery = null;
          }
          if (query.value) {
            subscriber.next({ loading: 'Google Drive' });
          } else {
            subscriber.next({ results: [] });
          }
        }),
        filter(query => Boolean(query.value)), // ignore empty query
        distinctUntilChanged(),
        debounceTime(150)
      )
      .subscribe(async ({ value }) => {
        let cancelled = false;
        cancelRunningQuery = () => { cancelled = true; };

        const files = await client.listFiles(value);
        if (cancelled) return;

        const searchResults = getGDriveFilesAsSearchResults(sdk, files, email);

        const tabsAsResourceIds = sdk.tabs.getTabs()
          .map(tab => idExtractor(tab.url) || '')
          .filter(x => Boolean(x));

        const isTabHasResourceId = compose(contained(tabsAsResourceIds), prop('resourceId'));
        const rejectResultIfAvailableAsTab = reject<search.SearchResultItem>(isTabHasResourceId);

        subscriber.next({
          ...searchResults,
          results: rejectResultIfAvailableAsTab(searchResults.results || []),
        });
      })
  ));
}

/**
 * Aggregate results from all GDrive accounts, and send them to browserX
 * @param {SDK} sdk
 * @param {Observable<search.SearchResultWrapper>[]} resultsObservable
 * @returns {Subscription | null}
 */
function updateResultsObservable(sdk: SDK, resultsObservable: Observable<search.SearchResultWrapper>[]) {
  if (updateResultsObservableSubscription) updateResultsObservableSubscription.unsubscribe();
  if (resultsObservable.length === 0) {
    sdk.search.results.next({});
  } else {
    // Keep only the last values of each of the consumers
    updateResultsObservableSubscription = combineLatest(resultsObservable)
      .pipe(map((resultsWrappers: search.SearchResultWrapper[]) => {
        // A list of all results, whatever the consumer
        const allResults: search.SearchResultItem[] = resultsWrappers.reduce(
          (accumulator: search.SearchResultItem[], currentValue) => accumulator.concat(currentValue.results || []),
          []
        );
        // A Set of all categories that are in loading state
        const allLoadingCategories: Set<string> = resultsWrappers.reduce(
          (accumulator, currentValue) => currentValue.loading ? accumulator.add(currentValue.loading) : accumulator,
          new Set<string>()
        );

        const ret: search.SearchResultWrapper = {
          results: allResults,
        };
        if (allLoadingCategories.size > 0) {
          ret.loading = Array.from(allLoadingCategories)[0];
        }
        return ret;
      }))
      .subscribe(sdk.search.results);
  }
  return updateResultsObservableSubscription;
}

function* initIpcListener(sdk: SDK) {
  // Update storage on remove
  yield from(sdk.ipc)
    .pipe(filter(m => m.type === 'REMOVE_TOKENS'))
    .subscribe(async (m: RemoveTokensAction) => {
      const allTokens = await sdk.storage.getItem<Tokens>('tokens');
      if (!allTokens) return;
      if (!(m.key in allTokens)) return;

      delete allTokens[m.key];
      await sdk.storage.setItem('tokens', allTokens);
    });

  // Trigger Google Auth process and store resulting token
  yield from(sdk.ipc)
    .pipe(filter(m => m.type === 'REQUEST_ADD_TOKENS'))
    .subscribe(async () => {
      const client = initClient(sdk);
      const token = await client.openAuthWindowAndGetTokens();

      const { sub } = decode(token.id_token as string);
      let allTokens = await sdk.storage.getItem<Tokens>('tokens');
      if (!allTokens) allTokens = {};
      allTokens[sub] = token;
      await sdk.storage.setItem('tokens', allTokens);
    });
}

/**
 * Init GDrive client
 *
 * @param {SDK} sdk
 * @param {Credentials} token
 * @returns {ElectronGDriveOAuth2}
 */
function initClient(sdk: SDK, token?: Credentials) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
  }
  const client = new ElectronGDriveOAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  if (token) {
    client.setTokens(token);
    client.oauth2Client.refreshAccessToken()
      .catch(async () => {
        const { sub } = decode(token.id_token as string);
        const allTokens = await sdk.storage.getItem<Tokens>('tokens') || {};
        if (allTokens[sub]) {
          allTokens[sub].expired = true;
          await sdk.storage.setItem('tokens', allTokens);
          setTimeout(
            () => {
              // FIXME wait for renderer to be ready
              sdk.ipc.publish({
                type: 'UPDATE_TOKENS',
                tokens: allTokens,
              } as UpdateTokensAction);
            },
            3000);
        }
      });
  }
  return client;
}

/**
 * Listen for updated tokens in order to store them
 * @param {SDK} sdk
 * @param {ElectronGDriveOAuth2} client
 * @param {Credentials} token
 */
function initClientTokensListener(sdk: SDK, client: ElectronGDriveOAuth2, token: Credentials) {
  let lastToken = token;
  client.on('tokens', async (renewedToken: Credentials) => {
    const { sub } = decode(renewedToken.id_token as string);
    lastToken = { ...lastToken, ...renewedToken };
    let allTokens = await sdk.storage.getItem<Tokens>('tokens');
    if (!allTokens) allTokens = {};
    allTokens[sub] = lastToken;
    await sdk.storage.setItem('tokens', allTokens);
  });
}

function tryGetEmail(token: Credentials) {
  if (!token.id_token) return;
  const { email } = decode(token.id_token);
  return email;
}

/**
 * Handle full initialization chain for a new GDrive account
 * @param {SDK} sdk
 * @param {Credentials} token
 * @returns {() => void}
 */
function initClientFull(sdk: SDK, token: Credentials) {
  const client = initClient(sdk, token);
  initClientTokensListener(sdk, client, token);
  const observable = initBindQuery(sdk, client, tryGetEmail(token));
  allResultsObservable.add(observable);
  startHistoryRecording(sdk, client, token, tryGetEmail(token));
  updateResultsObservable(sdk, Array.from(allResultsObservable));
  addResourcesHandler(sdk, token, client);

  return () => {
    client.removeAllListeners();
    allResultsObservable.delete(observable);
    updateResultsObservable(sdk, Array.from(allResultsObservable));
    stopHistoryRecording(sdk, token);
    removeResourcesHandler(sdk, token);
  };
}

function subtract<T = any>(a: Set<T>, b: Set<T>): Set<T> {
  return new Set([...a].filter(x => !b.has(x)));
}

async function initStorageListener(sdk: SDK) {
  sdk.storage.onChanged.addListener((changes) => {
    if (!('tokens' in changes)) return;
    handleNewTokens(sdk, changes.tokens.oldValue, changes.tokens.newValue);
  });
  handleNewTokens(sdk, [], await sdk.storage.getItem<Tokens>('tokens'));
}

const unsubscriptionMap = new Map<string, Function>();

/**
 * When tokens are updated, compute the diff, and call necessary initializers or unsubscriptions
 * @param {SDK} sdk
 * @param oldValue
 * @param newValue
 */
function handleNewTokens(sdk: SDK, oldValue: any, newValue: any) {
  const oldKeys = new Set(oldValue ? Object.keys(oldValue) : []);
  const newKeys = new Set(newValue ? Object.keys(newValue) : []);
  const deletedKeys = subtract(oldKeys, newKeys);
  const addedKeys = subtract(newKeys, oldKeys);

  for (const addedKey of addedKeys) {
    const unsubscribe = initClientFull(sdk, newValue[addedKey]);
    unsubscriptionMap.set(addedKey, unsubscribe);
  }

  for (const deletedKey of deletedKeys) {
    // TODO revoke refresh_token ?
    if (unsubscriptionMap.has(deletedKey)) {
      unsubscriptionMap.get(deletedKey)!();
      unsubscriptionMap.delete(deletedKey);
    }
  }

  sdk.ipc.publish({
    type: 'UPDATE_TOKENS',
    tokens: newValue,
  } as UpdateTokensAction);
}

/**
 * Init all accounts on activation
 * @param {SDK} sdk
 * @returns {Promise<void>}
 */
async function initClients(sdk: SDK) {
  let allTokens = await sdk.storage.getItem<Tokens>('tokens');

  subscriptions = Array.from(initIpcListener(sdk));
  if (!allTokens) return;
  if ('access_token' in allTokens) {
    allTokens = { expired: allTokens };
    allTokens.expired.expired = true;
    await sdk.storage.setItem('tokens', allTokens);
  }

  setTimeout(
    () => {
      // FIXME wait for renderer to be ready
      sdk.ipc.publish({
        type: 'UPDATE_TOKENS',
        tokens: allTokens,
      } as UpdateTokensAction);
    },
    3000);
}

export default {

  activate: async (sdk: SDK): Promise<void> => {
    const manifestURL = sdk.storage.id;
    await initClients(sdk);
    await initStorageListener(sdk);
    await startActivityRecording(sdk, manifestURL, resourceExtractor);
  },

  deactivate: (sdk: SDK): void => {
    subscriptions.forEach(s => s.unsubscribe());
    stopActivityRecording(sdk);
    stopHistoryRecording(sdk);
    sdk.close();
  },
};
