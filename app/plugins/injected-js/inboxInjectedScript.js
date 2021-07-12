const BADGE_META_NAME = 'browserx-badge';
const BADGE_META_SELECTOR = `meta[name=${BADGE_META_NAME}]`;

const updateBadge = function (badge) {
  let meta = document.querySelector(BADGE_META_SELECTOR);
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = BADGE_META_NAME;
    meta.content = '';
    document.head.appendChild(meta);
  }
  // update only if different
  if (meta.content !== badge) {
    meta.content = badge;
  }
};

let inboxObserver;
const inboxObserverConfig = { subtree: true, childList: true, characterData: true };

function initObserver() {
  const inboxContainers = document.getElementsByClassName('scroll-list-section-body');
  if (inboxObserver) {
    inboxObserver.disconnect();
  }
  inboxObserver = new MutationObserver(handleInboxMutations);
  const container = inboxContainers[0].parentNode.parentNode;
  inboxObserver.observe(container, inboxObserverConfig);
}

function classNameContains(node, searchFor) {
  return node && node.className && node.className.indexOf(searchFor) > -1;
}

function formatObject(text) {
  const cleanedText = text.replace(/^\s+|\s+$/g, '').replace(/^Unread\s+/g, '');
  const [sender, title, content] = cleanedText.split('\n');
  return {
    sender,
    title,
    content
  };
}

function handleInboxMutations(mutations) {
  mutations.forEach((mutation) => {
    if ((mutation.removedNodes.length === 0 && mutation.addedNodes.length === 1)
        && (classNameContains(mutation.addedNodes[0], 'scroll-list-item') ||
            classNameContains(mutation.addedNodes[0].firstChild, 'section-header'))) {
      if (mutation.addedNodes[0].parentNode.parentNode.children[0].innerText.replace(/^\s+|\s+$/g, '') === 'Today') {
        try {
          const notif = formatObject(mutation.addedNodes[0].outerText);
          new Notification(`${notif.sender} - ${notif.title}`, {
            body: notif.content,
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  });
}

// initObserver();

setInterval(() => {
  const unreadCount = document.getElementsByClassName('ss').length;
  updateBadge(unreadCount);
}, 2000);

const injectCSS = css => {
  const node = document.createElement('style');
  node.innerHTML = css;
  document.body.appendChild(node);
};

injectCSS(`
  a[href*="/SignOutOptions"] {
    visibility: hidden !important;
  }
`);
