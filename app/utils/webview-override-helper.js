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

module.exports = function RecursiveOverride(document, window, action) {
  const recursiveOverride = (windowObject, documentObject) => {
    action(windowObject);
    onReady(document).then(() => {
      const iframes = documentObject.getElementsByTagName('iframe');
      for (const iframe of iframes) {
        try {
          recursiveOverride(iframe.contentWindow, iframe.contentDocument);
        } catch (e) {
          // contentDocument can be inaccessible depending on CORS
          // we just ignores it because we can't do anything about it
        }
      }
    })
  };


  recursiveOverride(window, document);
};
