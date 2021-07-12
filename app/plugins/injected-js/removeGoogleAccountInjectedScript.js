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
