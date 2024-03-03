/* eslint-disable global-require */

// Exposed globals before preloads
const preload = Object.keys(window);

const { parse } = require('url');
const ipc = require('electron').ipcRenderer;
const equals = require('is-equal-shallow');

const BX_META_SELECTOR = 'meta[name^=browserx-]';

class BxMetasObserver {
  init() {
    this.metasValuesCached = {};
    this.emitMetasCurrentValuesIfChanged(true);
    this.startObserve();
  }

  startObserve() {
    this.headMutationObserver = new MutationObserver(
      this._onMutations.bind(this)
    );
    this.headMutationObserver.observe(document.head, {
      subtree: true,
      childList: true,
      attributes: true
    });
  }

  stopObserve() {
    this.headMutationObserver.disconnect();
  }

  _onMutations(mutations) {
    const attrChanges = mutations
      .filter(e => e.type === 'attributes')
      .filter(e => e.target.matches(BX_META_SELECTOR));
    if (attrChanges.length > 0) return this.emitMetasCurrentValuesIfChanged();

    // badge meta node removed
    const deletions = mutations
      .filter(e => e.type === 'childList')
      .filter(e => e.removedNodes.length > 0)
      // removedNodes is nodelist, convert
      .map(e => Array.from(e.removedNodes).filter(node => !!node.matches))
      .map(removedNodes =>
        removedNodes.find(node => node.matches(BX_META_SELECTOR))
      )
      .filter(removedNode => !!removedNode);
    if (deletions.length > 0) return this.emitMetasCurrentValuesIfChanged();

    const additions = mutations
      .filter(e => e.type === 'childList')
      .filter(e => e.addedNodes.length > 0)
      // addedNodes is nodelist, convert to array
      .map(e => Array.from(e.addedNodes).filter(node => !!node.matches))
      .map(addedNodes =>
        addedNodes.find(node => node.matches(BX_META_SELECTOR))
      )
      .filter(addedNode => !!addedNode);
    if (additions.length > 0) return this.emitMetasCurrentValuesIfChanged();
  }

  emitMetasCurrentValuesIfChanged(forceEmit) {
    const v = this.getCurrentMetasValues();
    const changed = !equals(v, this.metasValuesCached);
    if (changed || forceEmit) {
      ipc.sendToHost('page-bxmetas-updated', v);
    }
    this.metasValuesCached = v;
  }

  getCurrentMetasValues() {
    const metaEls = document.querySelectorAll(BX_META_SELECTOR);
    if (metaEls.length === 0) return {};

    const metaValues = {};
    Array.from(metaEls).forEach(metaEl => {
      const key = metaEl.name.match(/browserx-(.*)/)[1];
      metaValues[key] = metaEl.content;
    });
    return metaValues;
  }
}

const badgeObserver = new BxMetasObserver();
document.addEventListener(
  'DOMContentLoaded',
  () => {
    badgeObserver.init();

    // track any click so we use it as activity indicator
    document.body.addEventListener(
      'click',
      () => {
        ipc.sendToHost('page-click');
      },
      true
    );
  },
  false
);

// https://github.com/electron/electron/issues/3471
ipc.on('redirect-url', (event, url) => {
  window.location.assign(url);
});

// Fixes gdrive previews
if (typeof chrome === 'undefined') {
  window.chrome = undefined;
}

// Some apps like Qonto determine if browser is Chrome by checking if window.chrome.webstore exists
window.chrome = Object.assign({ webstore: true }, window.chrome);
if (!process.env.STATION_DISABLE_ECX) {
  require('electron-chrome-extension/preload');
}
require('./window-open');

// This piece of code is injected by `Google Drive Offline` extension
// It prevents Google drive from displaying the popup when copy/pasting
(function () {
  window._docs_chrome_extension_exists = !0;
  window._docs_chrome_extension_features_version = 1;
  window._docs_chrome_extension_permissions = [
    'alarms',
    'clipboardRead',
    'clipboardWrite',
    'storage',
    'unlimitedStorage'
  ];
})();

require('../../plugins/webview-preload');
require('../../notification-center/webview-preload');
require('../../dialogs/webview-preload');
require('../../ui/webview-preload');
require('./autologin');

// autofill is a hack that did not work properly
// so we decided to remove it for now
// see APP-760 for more context
// require('./autofill');

// Forward print actions to handle them in sagas
window.print = () => {
  ipc.send('print');
};

// Fix for GDrive: when the user-agent is Chrome compatible
// GDrive expect to have `window.chrome.rumtime` present
// https://github.com/electron/electron/issues/16587
if (!window.chrome.runtime) {
  window.chrome = Object.assign(
    {
      runtime: {
        connect: () => {
          return {
            onMessage: {
              addListener: () => {},
              removeListener: () => {}
            },
            postMessage: () => {},
            disconnect: () => {}
          };
        },
        sendMessage: (
          extensionId,
          message,
          /*optional*/ options,
          responseCallback
        ) => {
          if (typeof options === 'function') {
            responseCallback = options;
          }
          if (!responseCallback) return;
          if (typeof responseCallback !== 'function')
            throw new Error(
              'Error in invocation of runtime.sendMessage(optional string extensionId, any message, optional object options, optional function responseCallback): No matching signature.'
            );

          // Not implemented
          callSendMessageCallbackWithError(
            responseCallback,
            'Could not establish connection. Receiving end does not exist.'
          );
        },
        sendNativeMessage: (application, message, responseCallback) => {
          if (!responseCallback) return;
          if (typeof responseCallback !== 'function')
            throw new Error(
              'Error in invocation of runtime.sendNativeMessage(string application, object message, function responseCallback): No matching signature.'
            );

          // Not implemented
          callSendMessageCallbackWithError(
            responseCallback,
            'Could not establish connection. Receiving end does not exist.'
          );
        }
      }
    },
    window.chrome
  );
}

/**
 * `sendMessage` methods and alike do not really have an error callback
 * According to documentation, when an error occurs, `responseCallback`
 * will be called with no arguments and `lastError` will be set during
 * the execution of `responseCallback`.
 */

function callSendMessageCallbackWithError(responseCallback, errorMessage) {
  // after checking in Chrome, `lastError` is not an Error but an object
  window.chrome.runtime.lastError = { message: errorMessage };
  responseCallback();
  delete window.chrome.runtime.lastError;
}

require('../../webui/preload');

// Specifics
if (window.location.hostname === 'www.messenger.com') {
  require('./messengerPreload');
}
if (window.location.hostname === 'web.whatsapp.com') {
  require('./whatsappPreload');
}

// Prevents `Cmd+T` to be handled by any app (initialy made for slack app)
// Chrome does not emit `KeyboardEvent` for `t` when
// `Cmd+T` is pressed. We are trying to mimic a similar behavior.
// related issue: https://github.com/electron/electron/issues/19279
const isCmdT = e =>
  e.key === 't' && e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

window.addEventListener(
  'keydown',
  event => {
    if (isCmdT(event)) {
      event.stopPropagation();
    }
  },
  { capture: true }
);

// POST PRELOAD CLEANING

// Exposed globals after all executed preloads
const postload = Object.keys(window);

// List of allowed exposure on globals
export const whitelist = new Set([
  'bx',
  'chrome',
  '_docs_chrome_extension_exists',
  '_docs_chrome_extension_features_version',
  '_docs_chrome_extension_permissions',
]);

const { removeDiff } = require('./clean-global');

// Remove diff in globals (IF NOT WHITELISTED) to avoid leaks
removeDiff(preload, postload, whitelist, window);
