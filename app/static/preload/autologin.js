const ipc = require('electron').ipcRenderer;
const { fillInput } = require('./utils');

let currentForm;
let formFilled = false;
let bannerRemoveLinkDisplayed = false;

// Detector

const loginPageForm = document => Array.from(document.querySelectorAll('form'))
  .filter(form => isLoginForm(form))[0];

const isLoginForm = form => isVisible(form) &&
  hasSubmitButton &&
  hasPasswordField(form) &&
  hasOnlyNecessaryFields(form);


const isVisible = form => form.style.display !== 'none' && !form.hasAttribute('hidden');
const hasSubmitButton = form => Boolean(form.querySelector('input[type="submit"]') ||
  form.querySelector('button[type="submit"]'));
const hasPasswordField = form => Boolean(form.querySelector('input[type="password"]'));
const hasOnlyNecessaryFields = form => Array.from(form
  .querySelectorAll('input[type="email"], input[type="text"] input[name="login"]'))
  .filter(input => input.style.display !== 'none')
  .length === 1;

// Logger

const getCredentials = () => {
  if (!formFilled) ipc.send('autologin-get-credentials');
};

const fillCurrentForm = (login, canAutoSubmit) => {
  const usernameInput = currentForm.querySelector('input[type="email"], input[type="text"] input[name="login"]');
  const passwordInput = currentForm.querySelector('input[type="password"]');

  fillInput(usernameInput, login.username);
  fillInput(passwordInput, login.password);

  if (canAutoSubmit) submitForm(currentForm);

  formFilled = true;
};

const submitForm = form => {
  setTimeout(() => {
    const submitButton = findSubmitButton(form);
    if (submitButton) {
      triggerSubmitButton(submitButton);
    }
  }, 300);
};

const findSubmitButton = form =>
  form.querySelector('input[type="submit"]') ||
  form.querySelector('button[type="submit"]') ||
  form.querySelector('div[role="button"]') ||
  Array.from(form.querySelectorAll('button')).find(button =>
    ['sign in', 'login', 'log in'].includes(button.textContent.toLowerCase()));

const triggerSubmitButton = submitButton => {
  try {
    submitButton.click();
  } catch (e0) {
    try {
      submitButton.submit();
    } catch (e1) {
      if (e1 instanceof TypeError) {
        try {
          submitButton.submit.click();
        } catch (e2) {
          console.error(e2);
        }
      }
    }
  }
};
// Banner remove link

const displayRemoveLinkBanner = () => {
  if (!bannerRemoveLinkDisplayed) {
    bannerRemoveLinkDisplayed = true;
    ipc.send('autologin-display-removeLinkBanner');
  }
};

// Events

ipc.on('autologin-value-retrieved', (e, login, autoSubmit) => {
  if (currentForm) return fillCurrentForm(login, autoSubmit);
});

document.addEventListener('DOMContentLoaded', e => {
  currentForm = loginPageForm(document);

  if (!currentForm) {
    setTimeout(() => {
      currentForm = loginPageForm(document);
      if (currentForm) return getCredentials();
    }, 750);
  } else {
    setTimeout(() => {
      if (document.contains(currentForm)) {
        return getCredentials();
      }
    }, 1750);
  }
}, false);

document.addEventListener('focusin', e => {
  const { target } = e;

  if (currentForm && currentForm.hasChildNodes(target) && formFilled) {
    const inputs = Array.from(currentForm
      .querySelectorAll('input[type="email"], input[type="text"], input[name="login"], input[type="password"]'))
      .filter(input => input.style.display !== 'none');

    inputs.forEach(input => {
      input.addEventListener('keyup', () => displayRemoveLinkBanner());
      input.addEventListener('paste', () => displayRemoveLinkBanner());
    });
  } else {
    const form = target.closest('form');

    if (!form) return;

    currentForm = form;

    if (isLoginForm(form)) return getCredentials();
  }
}, false);
