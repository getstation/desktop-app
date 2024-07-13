
console.log('>>>>>> WebView inject start');

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

// Notifications

const GRANTED = 'granted';

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

    const newNotification = {
      id: this.id,
      timestamp: this.timestamp,
      title: this.title,
      body: this.body,
      icon: this.icon,
    };

    console.log('>>>>>> New notification 1', (new Date()).toLocaleTimeString(), JSON.stringify(newNotification));

    let fixedIconUrl = this.icon;
    if (typeof fixedIconUrl === 'string') {
      //vk: I have no idea why but...
      if (fixedIconUrl.startsWith('//')) {  // Gmail
        fixedIconUrl = 'https:' + this.icon;
      }
      else if (fixedIconUrl.startsWith('blob:http')) {  // Telegram
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            const reader = new FileReader();
            reader.onload = function(event) {
              window.bxApi.notificationCenter.sendNotification(this.id, {
                ...newNotification,
                icon: event.target.result,
              });          
            }
            reader.readAsDataURL(xhr.response);
          }
        };
        xhr.open('GET', fixedIconUrl);
        xhr.send();
        return;
      }
    }
    else {
      console.log('Unsupported notification icon type', (typeof fixedIconUrl));
      fixedIconUrl = undefined;
    }

    window.bxApi.notificationCenter.sendNotification(this.id, {
      ...newNotification,
      icon: fixedIconUrl,
    });
  }

  _registerIPC() {
    window.bxApi.notificationCenter.addNotificationClickListener(this._handleNotificationClickIPC);
  }

  _unregisterIPC() {
    try {
      console.log('unregisterIPC');
      window.bxApi.notificationCenter.removeNotificationClickListener(this._handleNotificationClickIPC);
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
    console.log('close');
    try {
      window.bxApi.notificationCenter.closeNotification(this.id);
    } catch (error) {
      console.log('ERROR close', error);
    }
  }

  get onclick() {
    console.log('get onclick');
    return null;
  }
  set onclick(value) {
    console.log('set onclick');
  }  

  get onclose() {
    console.log('get onclose');
    return null;
  }
  set onclose(value) {
    console.log('set onclose');
  }  

  get onerror() {
    console.log('get onerror');
    return null;
  }
  set onerror(value) {
    console.log('set onerror');
  }  

  get onshow() {
    console.log('get onshow');
    return null;
  }
  set onshow(value) {
    console.log('set onshow');
  }  

  dispatchEvent(event) {
    console.log('dispatchEvent', event);
  }

  addEventListener(type, listener, options) {
    console.log('addEventListener', type);
  }

  removeEventListener(type, listener, options) {
    console.log('removeEventListener', type);
  }

  requestPermission(deprecatedCallback) {
    const request = Promise.resolve(GRANTED);
    if (deprecatedCallback) {
      request.then(deprecatedCallback);
    }
    return request;
  }
}

const overrideNotifications = () => {
  BxNotification.permission = GRANTED;

  // window.Notification = BxNotification;
  recursiveOverride(document, window, (windowObject) => { windowObject.Notification = BxNotification });
  
  console.log('>>>>>> Notification override. Done');
}

overrideNotifications();

