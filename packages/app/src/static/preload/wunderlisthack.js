/**
 * Fix electron own window-setup override to allow Saas to override window.history.length.
 * Original electron implementation https://github.com/electron/electron/blob/d597a0e8b0121b54375412af3d8a4a9db60ba21a/lib/renderer/window-setup.ts#L233
 */
// todo remove when https://github.com/electron/electron/pull/17742 is merged
function overrideHistory() {
  // History object without `length` prop.
  const proto = Object.getPrototypeOf(window.history);
  const newHisto = Object.create(proto);

  const { length, ...histo } = window.history;
  Object.assign(newHisto, histo);

  Object.defineProperty(newHisto, 'length', {
    value: 0,
    configurable: true,
  });
  // Affect new object to window.history
  Object.defineProperty(window, 'history', {
    value: newHisto,
    configurable: true,
    enumerable: true,
  });
}

overrideHistory();
