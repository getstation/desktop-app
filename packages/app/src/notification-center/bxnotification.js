
console.log('ZZZZZZ', (typeof notificationModuleDefined));

if (typeof notificationModuleDefined === 'undefined') {

const notificationModuleDefined = true;

console.log('ZZZZZZ 1 we are here', (typeof notificationModuleDefined));


const GRANTED = 'granted';

// nanoid (copy from https://github.com/ai/nanoid/blob/main/non-secure/index.js)
const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

const nanoid = (size = 21) => {
  let id = ''
  // A compact alternative for `for (var i = 0; i < step; i++)`.
  let i = size
  while (i--) {
    // `| 0` is more compact and faster than `Math.floor()`.
    id += urlAlphabet[(Math.random() * 64) | 0]
  }
  return id
}
// nanoid

////////////////////////////

const onReady = (documentObject) => {
  const isReady = (x) => x === 'complete';
  return new Promise((resolve) => {
    if (isReady(documentObject.readyState)) {
      resolve();
    } else {
      documentObject.addEventListener('readystatechange', (e) => {
        if (isReady(e.target.readyState)) {
          resolve();
        }
      }, false);
    }
  });
};

const recursiveOverride = (document, window, action) => {
  const recursiveOverrideInt = (windowObject, documentObject) => {
    action(windowObject);
    onReady(document).then(() => {
      const iframes = documentObject.getElementsByTagName('iframe');
      for (const iframe of iframes) {
        try {
          recursiveOverrideInt(iframe.contentWindow, iframe.contentDocument);
        } 
        catch (e) {
          // contentDocument can be inaccessible depending on CORS
          // we just ignores it because we can't do anything about it
        }
      }
    })
  };

  recursiveOverrideInt(window, document);
};

// const recursiveOverride = (windowObject, documentObject, action) => {
//   action(windowObject);
//   onReady(document).then(() => {
//     const iframes = documentObject.getElementsByTagName('iframe');
//     for (const iframe of iframes) {
//       try {
//         recursiveOverride(iframe.contentWindow, iframe.contentDocument, action);
//       } 
//       catch (e) {
//         // contentDocument can be inaccessible depending on CORS
//         // we just ignores it because we can't do anything about it
//       }
//     }
//   })
// };

////////////////////////////


const getDefaultProperties = (title) => ({
  actions: [],
  badge: '',
  body: '',
  data: null,
  dir: 'auto',
  lang: '',
  tag: '',
  icon: '',
  image: '',
  requireInteraction: false,
  silent: false,
  timestamp: (new Date()).getTime(),
  title,
  vibrate: [],
});

class BxNotification {
  constructor(title, options = {}) {
    // Chrome, Safari, etc. does not throw when title is empty string
    if (!title && title !== '') {
      throw new Error('Title is required');
    }
    this.id = `notif/${nanoid()}`;

    // default properties
    const properties = Object.assign({ }, getDefaultProperties(title), options || {});

    Object.keys(properties).forEach(key => {
      Object.defineProperty(this, key, {
        value: properties[key],
        writable: false,
      });
    });

    this._registerIPC();

    console.log(
      '>>>>>> New notification 1', (new Date()).toLocaleTimeString(), JSON.stringify({
        id: this.id,
        timestamp: this.timestamp,
        title: this.title,
        body: this.body,
        icon: this.icon,
      })
    );

    window.bx.notificationCenter.sendNotification(this.id, {
      timestamp: this.timestamp,
      title: this.title,
      body: this.body,
      icon: this.icon,
    });
  }

  _registerIPC() {
    window.bx.notificationCenter.addNotificationClickListener(this._handleNotificationClickIPC);
  }

  _unregisterIPC() {
    try {
      console.log('unregisterIPC');
      window.bx.notificationCenter.removeNotificationClickListener(this._handleNotificationClickIPC);
    } catch (error) {
      console.log('ERROR unregisterIPC', error);
    }
  }

  _handleNotificationClickIPC(_e /*: Event */, notificationId /*: string */) {
    if (this.id !== notificationId) {
      return;
    }
    this.dispatchEvent(new MouseEvent('click'));
    this._unregisterIPC();
  }

  close() {
    try {
      console.log('close');
      window.bx.notificationCenter.closeNotification(this.id);
    } catch (error) {
      console.log('ERROR close', error);
    }
  }
}

// BxNotification.permission = GRANTED;

// //window.Notification = BxNotification;
// recursiveOverride(document, window, (windowObject) => { windowObject.Notification = BxNotification });

// console.log('>>>>>> Notification override. Done');

}
