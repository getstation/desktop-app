setInterval(() => {
  const counter = document.querySelector('span[title*=\'Inbox\'] + div > span')
  if (!counter || counter.length < 1) return;

  const inboxText = counter.textContent;
  if (!inboxText) return updateBadge('');

  const badge = parseInt(inboxText, 10);
  updateBadge(badge);
}, 2000);

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