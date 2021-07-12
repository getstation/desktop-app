// Require the electron spellchecker
const {
  SpellCheckHandler,
  setGlobalLogger
} = require('@getstation/electron-spellchecker');
const log = require('electron-log');
const { ipcRenderer } = require('electron');

setGlobalLogger((...args) => {
  log.debug('[electron-spellchecker]', ...args);
});

const spellCheckHandler = new SpellCheckHandler();
setTimeout(() => window.spellCheckHandler.attachToInput(), 1000);

spellCheckHandler.autoUnloadDictionariesOnBlur();

// answer to queries for spellceking
ipcRenderer.on('spellchecker-get-correction', (event, misspelledWord) => {
  if (!spellCheckHandler.currentSpellchecker) {
    ipcRenderer.send('spellchecker-get-correction-response', null);
  }
  // Ensure that we have valid corrections for that word
  spellCheckHandler.getCorrectionsForMisspelling(misspelledWord)
    .then(corrections => ipcRenderer.send('spellchecker-get-correction-response', corrections))
    .catch(console.error);
});

window.spellCheckHandler = spellCheckHandler;
