(() => {
  const observer = new MutationObserver((mutations) => {
    checkTitle(mutations[0].target.innerText);
  });

  observer.observe(
    document.getElementsByTagName('title')[0],
    { subtree: true, characterData: true, childList: true }
  );
})();

const updateBadge = function (badge) {
  let meta = document.querySelector('meta[name=browserx-badge]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'browserx-badge';
    meta.content = '';
    document.head.appendChild(meta);
  }
  // update only if different
  if (meta.content !== badge) {
    meta.content = badge;
  }
};

function checkTitle(title) {
  const REGEX_TITLE = /^\((\d+)\)/;
  const REGEX_TITLE_RAW = /^Messenger$/;
  if (title) {
    let match = title.match(REGEX_TITLE);
    if (match) {
      updateBadge(match[1]);
    }

    match = title.match(REGEX_TITLE_RAW);
    if (match) {
      updateBadge('');
    }
  }
}
