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

setInterval(() => {
  // inspired from https://github.com/ramboxapp/community-edition/blob/master/app/store/ServicesList.js#L116
  const aim = document.getElementsByClassName("aim")[0].textContent.split(":");
  const badge = parseInt(aim[aim.length - 1].replace(/[^0-9]/g, ""))

  if (isNaN(badge)) {
    return updateBadge('');
  }

  return updateBadge(badge);
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
