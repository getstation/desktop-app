// Inspired by https://github.com/keokilee/react-electron-webview/
import keycode = require('keycode');
import camelCase = require('lodash.camelcase');
// @ts-ignore: no declaration file
import { shallowEquals } from 'redux-observers';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { logger } from '../../api/logger';
import { Omit } from '../../types';
import { dissoc } from 'ramda';
import { webContents as remoteWebContents } from '@electron/remote';

export interface ElectronWebviewProps extends Omit<Electron.WebviewTag, 'src'> {
  // webview `src` is updated by the webview itself, so we do not want to
  // update it ourselves directly. Instead we must call `loadUrl` on underlying
  // webcontents, and the webview will update the src attribute accordingly.
  // `initialSrc` is just taken into account once, when the Component is mounting.
  initialSrc?: string;

  hidden: boolean;
  className: string;
  preload: string;
  allowpopus: string;

  onDidAttach?: EventListener;
  onLoadCommit?: EventListener;
  onDidFinishLoad?: EventListener;
  onDidFailLoad?: EventListener;
  onDidFrameFinishLoad?: EventListener;
  onDidStartLoading?: EventListener;
  onDidStopLoading?: EventListener;
  onDomReady?: EventListener;
  onPageTitleSet?: EventListener;
  onPageTitleUpdated?: EventListener;
  onPageFaviconUpdated?: EventListener;
  onEnterHtmlFullScreen?: EventListener;
  onLeaveHtmlFullScreen?: EventListener;
  onConsoleMessage?: EventListener;
  onNewWindow?: EventListener;
  onClose?: EventListener;
  onIpcMessage?: EventListener;
  onCrashed?: EventListener;
  onGpuCrashed?: EventListener;
  onPluginCrashed?: EventListener;
  onDestroyed?: EventListener;
}

export const changableProps = {
  useragent: 'setUserAgent',
  devtools: 'setDevTools',
  muted: 'setAudioMuted',
};

export const events = [
  'load-commit',
  'did-attach',
  'did-finish-load',
  'did-fail-load',
  'did-frame-finish-load',
  'did-start-loading',
  'did-stop-loading',
  'dom-ready',
  'page-title-set', // deprecated event
  'page-title-updated',
  'page-favicon-updated',
  'enter-html-full-screen',
  'leave-html-full-screen',
  'console-message',
  'found-in-page',
  'new-window',
  'will-navigate', // do not use it, not reliable in some cases electron/electron#14751
  'did-navigate',
  'did-navigate-in-page',
  'close',
  'ipc-message',
  'crashed',
  'gpu-crashed',
  'plugin-crashed',
  'destroyed',
  'media-started-playing',
  'media-paused',
  'did-change-theme-color',
  'update-target-url',
  'devtools-opened',
  'devtools-closed',
  'devtools-focused',
];

export const methods = [
  'loadURL',
  'getURL',
  'getTitle',
  'isLoading',
  'isWaitingForResponse',
  'stop',
  'reload',
  'reloadIgnoringCache',
  'canGoBack',
  'canGoForward',
  'canGoToOffset',
  'clearHistory',
  'goBack',
  'goForward',
  'goToIndex',
  'goToOffset',
  'isCrashed',
  'setUserAgent',
  'getUserAgent',
  'insertCSS',
  'executeJavaScript',
  'openDevTools',
  'closeDevTools',
  'isDevToolsOpened',
  'isDevToolsFocused',
  'inspectElement',
  'inspectServiceWorker',
  'setAudioMuted',
  'isAudioMuted',
  'undo',
  'redo',
  'cut',
  'copy',
  'paste',
  'pasteAndMatchStyle',
  'delete',
  'selectAll',
  'unselect',
  'replace',
  'replaceMisspelling',
  'insertText',
  'findInPage',
  'stopFindInPage',
  'print',
  'printToPDF',
  'capturePage',
  'send',
  'sendInputEvent',
  'setZoomFactor',
  'setZoomLevel',
  'showDefinitionForSelection',
  'getWebContents',
  'focus',
];

/*
 * Electron keyboard events (@see https://electronjs.org/docs/api/web-contents#event-before-input-event)
 * can't entirely be converted to KeyboardEvent (@see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent).
 * If we naïvely convert from the first to the second, `which` and `keyCode` attributes will not have the proper values.
 * Even if those props are deprecated, Mousetrap lib still uses them.
 * The goal of this function is to try to guess the values of those 2 attributes.
 */
export const getKeyboardKeyCode = (key: string, code: string) => {
  switch (key) {
    case 'ArrowLeft':
      return 37;
    case 'ArrowUp':
      return 38;
    case 'ArrowRight':
      return 39;
    case 'ArrowDown':
      return 40;
    case 'Meta':
      return 91;
    default:
      switch (code) {
        case 'Digit0':
          return 48;
        case 'Digit1':
          return 49;
        case 'Digit2':
          return 50;
        case 'Digit3':
          return 51;
        case 'Digit4':
          return 52;
        case 'Digit5':
          return 53;
        case 'Digit6':
          return 54;
        case 'Digit7':
          return 55;
        case 'Digit8':
          return 56;
        case 'Digit9':
          return 57;
        default:
          return keycode(key);
      }
  }
};

const getRealPropName = (propName: string) => {
  switch (propName) {
    case 'initialSrc':
      return 'src';
    default:
      return propName;
  }
};

const getPropString = (propName: string, value: unknown): string => {
  const realPropName = getRealPropName(propName);
  if (typeof value === 'boolean') {
    return `${realPropName}="${value ? 'on' : 'off'}" `;
  }
  return `${realPropName}=${JSON.stringify(String(value))} `;
};

const removeInitialSrcProp = dissoc('initialSrc');

// Additional dynamically generated members
interface ElectronWebview {
  reload: () => any;
  isDevToolsOpened: Function;
  getURL: () => any;
  goForward: () => any;
  goBack: () => any;
  openDevTools: () => any;
  closeDevTools: () => any;
  getTitle: () => any;
  pasteAndMatchStyle: () => any;
}

class ElectronWebview extends React.Component<ElectronWebviewProps, {}> {
  public view: Electron.WebviewTag;
  protected ref: HTMLElement;
  protected ready: boolean;
  private loaded: boolean;

  constructor(props: ElectronWebviewProps) {
    super(props);
    this.ready = false;
  }

  componentDidMount() {
    const container = ReactDOM.findDOMNode(this.ref);

    let propString = '';
    Object.keys(this.props).forEach((propName) => {
      // Waiting for a fix https://github.com/electron/electron/issues/9618
      if (this.props[propName] !== undefined && typeof this.props[propName] !== 'function') {
        propString += getPropString(propName, this.props[propName]);
      }
    });
    if (this.props.className) {
      propString += `class="${this.props.className}" `;
    }
    propString += 'tabindex="-1" ';
    container.innerHTML = `<webview ${propString}/>`;
    this.view = container.querySelector('webview') as Electron.WebviewTag;

    this.view.addEventListener('did-finish-load', () => {
      if (!this.loaded) {
        this.loaded = true;
        this.updateClassName(this.props);
      }
    });

    // To ease end-to-end tests
    const webviewStartLoadingCb = () => {
      document.dispatchEvent(new Event('webview-did-start-loading'));
      this.view.removeEventListener('did-start-loading', webviewStartLoadingCb);
    };
    this.view.addEventListener('did-start-loading', webviewStartLoadingCb);

    this.view.addEventListener('did-attach', (...attachArgs: any[]) => {
      this.ready = true;
      this.forwardKeyboardEvents();
      events.forEach((event) => {
        const propName = camelCase(`on-${event}`);
        if (this.props[propName]) {
          this.view.addEventListener(event, this.props[propName], false);
        }
      });
      if (this.props.onDidAttach) this.props.onDidAttach(...attachArgs);
    });

    this.view.addEventListener('dom-ready', () => {
      // Remove this once https://github.com/electron/electron/issues/14474 is fixed
      this.view.blur();
      this.view.focus();
    });

    methods.forEach((method) => {
      if (this[method]) return;
      this[method] = (...args: any[]) => {
        if (!this.ready) return;
        try {
          return this.view[method](...args);
        } catch (e) {
          logger.notify(e);
        }
      };
    });
  }

  /**
   * With Electron 3.0 webviews, events are not bubbled-up anymore.
   * The goal of this method is to simulate the old behaviour.
   */
  forwardKeyboardEvents() {
    // Inspired by https://github.com/electron/electron/issues/14258#issuecomment-416893856
    remoteWebContents
      .fromId(this.view.getWebContentsId())
      .on('before-input-event', (_event, input) => {
        // Create a fake KeyboardEvent from the data provided
        const emulatedKeyboardEvent = new KeyboardEvent(
          input.type.toLowerCase(),
          {
            code: input.code,
            key: input.key,
            shiftKey: input.shift,
            altKey: input.alt,
            ctrlKey: input.control,
            metaKey: input.meta,
            repeat: input.isAutoRepeat,
            bubbles: true,
            composed: true,
            cancelable: true
          }
        );
        // Workaround for mousetrap
        const keyCodeValue = getKeyboardKeyCode(
          emulatedKeyboardEvent.key,
          emulatedKeyboardEvent.code
        );
        Object.defineProperty(emulatedKeyboardEvent, 'which', {
          value: keyCodeValue
        });
        Object.defineProperty(emulatedKeyboardEvent, 'keyCode', {
          value: keyCodeValue
        });

        this.view.dispatchEvent(emulatedKeyboardEvent);
      });
  }

  shouldComponentUpdate(nextProps: ElectronWebviewProps) {
    return !shallowEquals(removeInitialSrcProp(this.props), removeInitialSrcProp(nextProps));
  }

  componentDidUpdate(prevProps: ElectronWebviewProps) {
    Object.keys(changableProps).forEach((propName) => {
      const propValue = this.props[propName];
      if (propValue !== prevProps[propName]) {
        this[changableProps[propName]](propValue);
      }
    });
  }

  updateClassName = (props = this.props) => {
    if (this.ready && this.loaded) {
      const className = `${props.className} ${props.hidden ? 'hidden' : ''}`;
      return this.view.setAttribute('class', className);
    }
  };

  // tslint:disable-next-line:function-name
  UNSAFE_componentWillReceiveProps(nextProps: ElectronWebviewProps) {
    if (this.props.hidden !== nextProps.hidden) {
      this.updateClassName(nextProps);
    }
  }

  focus() {
    if (!this.view) return;
    // Calling `.focus()` on an already focused webview actually blurs it.
    // see https://github.com/electron/electron/issues/13697
    if (document.activeElement && (document.activeElement as HTMLElement).blur) {
      (document.activeElement as HTMLElement).blur();
    }
    this.view.focus();
  }

  setDevTools(open: boolean) {
    if (open && !this.isDevToolsOpened()) {
      this.openDevTools();
    } else if (!open && this.isDevToolsOpened()) {
      this.closeDevTools();
    }
  }

  isReady() {
    return this.ready;
  }

  render() {
    return (
      <div
        ref={elt => {
          this.ref = elt as HTMLElement;
        }}
        style={(this.props.style as object) || {}}
      />
    );
  }
}

export default ElectronWebview;
