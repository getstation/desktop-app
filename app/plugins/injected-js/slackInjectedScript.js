/* ************** CONSTANTS **************** */
const INTERVAL_MS = 500;
const TIMEOUT_MS = 10000;

const CSS_TO_INJECT = `
#macssb1_banner {
  display: none !important;
}`;

const WITH_BADGE = '•';
const WITHOUT_BADGE = '';

const META_PREFIX = 'browserx';

const BADGE_KEY = 'badge';
const API_TOKEN_KEY = 'apiToken';

const LOG_PREFIX = '[BROWSERX]';

const error = (...args) => console.error(LOG_PREFIX, ...args);
const log = (...args) => console.log(LOG_PREFIX, ...args);

/* ************** UTILS **************** */
const createBxMetaTagUpdater = metaName => value => {
  const selector = `meta[name=${META_PREFIX}-${metaName}]`;
  let meta = document.querySelector(selector);
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = `${META_PREFIX}-${metaName}`;
    meta.content = '';
    document.head.appendChild(meta);
  }
  // update only if different
  if (meta.content !== value) {
    meta.content = value;
  }
};

const updateBadge = createBxMetaTagUpdater(BADGE_KEY);
const updateToken = createBxMetaTagUpdater(API_TOKEN_KEY);

const getCurrentTeamId = () => {
  return window.location.pathname.split('/')[2];
};

const getSlackStore = () => {
  const teamId = getCurrentTeamId();
  if (!teamId) return;
  const team = window.slackDebug && window.slackDebug[teamId];
  if (!team) return;
  const store = team.redux;
  return store;
};

const getLegacyModel = () => {
  if (window.TS && window.TS.model) return window.TS.model;
};

const subscribeSlackStoreValue = (store, selector, handler) => {
  let currentValue;

  return store.subscribeImmediate(() => {
    const previousValue = currentValue;
    currentValue = selector(store.getState());

    if (currentValue !== previousValue) {
      handler(currentValue);
    }
  });
};

const legacySubscription = (model) => {
  setInterval(() => {
    updateToken(model.api_token);

    if (model.all_unread_highlights_cnt) {
      updateBadge(WITH_BADGE);
    } else {
      updateBadge(WITHOUT_BADGE);
    }
  }, INTERVAL_MS);
};

const waitValue = (getter) => new Promise((resolve) => {
  let intervalId = null;
  let timeoutId = null;

  const clear = () => {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
  };

  intervalId = setInterval(() => {
    const value = getter();
    if (value) {
      clear();
      resolve(value);
    }
  }, INTERVAL_MS);

  timeoutId = setTimeout(() => {
    clear();
    resolve(null);
  }, TIMEOUT_MS);
});

const getToken = (state) => state.bootData.api_token;
const getBadge = (state) => {
  const { countsPerChannel } = state.unreadCounts;
  const nbMentions = Object.values(countsPerChannel)
    .map(({ unreadHighlightCnt }) => unreadHighlightCnt)
    .reduce((acc, nb) => acc + nb, 0); // sum
  return nbMentions ? WITH_BADGE : WITHOUT_BADGE;
};

const injectCSS = css => {
  const node = document.createElement('style');
  node.innerHTML = css;
  document.body.appendChild(node);
};

/* ************** MAIN SCRIPT **************** */
const slackInjectionScript = async () => {
  // css injection
  injectCSS(CSS_TO_INJECT);

  log('wait for model or redux store...');

  const storeOrModel = await Promise.race([
    waitValue(getSlackStore),
    waitValue(getLegacyModel),
  ]);

  if (storeOrModel && storeOrModel.getState) { // new slack version
    const store = storeOrModel;

    // subscribe to token
    subscribeSlackStoreValue(store, getToken, updateToken);
    // subscribe to badge state
    subscribeSlackStoreValue(store, getBadge, b => {
      log(`Update BADGE: '${b}'`);
      return updateBadge(b);
    });
    log('redux store loaded (new slack version)');
  } else if (storeOrModel) { // old slack version
    const model = storeOrModel;
    legacySubscription(model);
    log('subscribed to model (old slack version)');
  } else {
    error('Unable to find model or redux store');
  }
};
/* ******************************************* */

// execute script
slackInjectionScript().catch(error);
