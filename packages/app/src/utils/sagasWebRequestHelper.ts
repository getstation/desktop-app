import {
  Channel,
  eventChannel,
} from 'redux-saga';

type webRequestEventsMethodsWithCallback =
  'onBeforeRequest' |
  'onBeforeSendHeaders' |
  'onHeadersReceived';
type webRequestEventsMethodsWithoutCallback =
  'onSendHeaders' |
  'onResponseStarted' |
  'onBeforeRedirect' |
  'onCompleted' |
  'onErrorOccurred';
type webRequestEventsMethods = webRequestEventsMethodsWithCallback | webRequestEventsMethodsWithoutCallback;

export function createWebRequestChannel(session: Electron.Session, event: 'onBeforeRequest'):
  Channel<Electron.OnBeforeRequestDetails>;
export function createWebRequestChannel(session: Electron.Session, event: 'onBeforeSendHeaders'):
  Channel<Function>;
export function createWebRequestChannel(session: Electron.Session, event: 'onSendHeaders'):
  Channel<Electron.OnSendHeadersDetails>;
export function createWebRequestChannel(session: Electron.Session, event: 'onHeadersReceived'):
  Channel<Function>;
export function createWebRequestChannel(session: Electron.Session, event: 'onResponseStarted'):
  Channel<Electron.OnResponseStartedDetails>;
export function createWebRequestChannel(session: Electron.Session, event: 'onBeforeRedirect'):
  Channel<Electron.OnBeforeRedirectDetails>;
export function createWebRequestChannel(session: Electron.Session, event: 'onCompleted'):
  Channel<Electron.OnCompletedDetails>;
export function createWebRequestChannel(session: Electron.Session, event: 'onErrorOccurred'):
  Channel<Electron.OnErrorOccurredDetails>;
export function createWebRequestChannel(session: Electron.Session, event: webRequestEventsMethods) {
  return eventChannel((emitter: Function) => {
    // attach EventEmitter to given method
    (session.webRequest[event] as Function)((details: any) => emitter(details));
    return () => {};
  });
}
