const ipc = require('electron').ipcRenderer;
const memoize = require('memoizee/weak');
const { fillInput } = require('./utils');

let currentAutocompletedInput;

// List of allowed values for autocomplete attributes on email field
const autocompleteWhitelist = [
  'on',
  'email',
  'username',
];

const isAutocompleteEmailAuthorized = memoize((target) => {
  // Check if allowed autocomplete attribute when present
  // (if not present, HTML specifies the default value is ON)
  if (target.autocomplete && !autocompleteWhitelist.includes(target.autocomplete)) return false;

  // Check if correct field type
  if (target.type !== 'text' && target.type !== 'email') return false;

  // Check that it's contained in a <form>
  const form = target.closest('form');
  if (!form) return false;

  // Check that there is an <input type="password"/>
  const password = form.querySelector('input[type="password"]');

  return Boolean(password);
});

ipc.on('autofill-value-chosen', (e, value) => {
  if (currentAutocompletedInput) {
    fillInput(currentAutocompletedInput, value);
  }
});

document.addEventListener('focusin', e => {
  if (e.target && isAutocompleteEmailAuthorized(e.target)) {
    currentAutocompletedInput = e.target;
    const rect = e.target.getBoundingClientRect();
    ipc.send('ask-autofill-popup', {
      bottom: rect.bottom,
      height: rect.height,
      left: rect.left,
      right: rect.right,
      top: rect.top,
      width: rect.width
    });
  }
}, false);
