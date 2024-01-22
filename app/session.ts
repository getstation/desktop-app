import { Session, OnBeforeSendHeadersListenerDetails, BeforeSendResponse } from 'electron';
import enhanceWebRequest from 'electron-better-web-request';

/*
These applications are sensitive to the User-Agent header and have to be rechecked in case of changing the default value:
- Google Meet (299.json)
- Google Chat (517.json)

it's better to remove bx_override_user_agent attribute from manifest before the check to be sure that it's still necessary.
*/
const defaultUserAgent = 'Chrome/114.0.5735.289';

const getUserAgentForApp = (url: string, currentUserAgent: string): string => {

  if (url.startsWith('file://') || url.startsWith('http://localhost')) {
    return currentUserAgent;
  }

  return defaultUserAgent;
};

const getHeaderName = (headerName: string, headers?: Record<string, string>): string | undefined => {
  if (headers) {
    const lowCaseHeader = headerName.toLowerCase();
    for (const key in headers) {
      if (key.toLowerCase() === lowCaseHeader) {
        return key;
      }
    }
  }
  return undefined;
}

export const getHeader = (headerName: string, headers?: Record<string, any>): any => {
  const realHeaderName = getHeaderName(headerName, headers);
  return headers && realHeaderName ? headers[realHeaderName] : undefined;
}

export const setHeader = (headerName: string, headerValue: any, headers?: Record<string, any>) => {
  if (headers) {
    const realHeaderName = getHeaderName(headerName, headers);
    return {
      ...headers,
      [realHeaderName ? realHeaderName : headerName]: headerValue,
    };
  }
  return headers;
}

export const getRefererForApp = (referer: string): string => {
  return referer && referer.startsWith('http://localhost') ? '' : referer;
};

export const enhanceSession = (session: Session) => {
  enhanceWebRequest(session);

  session.setUserAgent(defaultUserAgent);

  // session.webRequest.onBeforeRequest(
  //     (details: OnBeforeRequestListenerDetails, callback: (response: CallbackResponse) => void) => {
  //       console.log('AAAAAA', details.url, ' ||| ', session.getStoragePath());
  //       callback({ cancel: false });
  //     }
  // );

  session.webRequest.onBeforeSendHeaders(
      (details: OnBeforeSendHeadersListenerDetails, callback: (beforeSendResponse: BeforeSendResponse) => void) => {
        details.requestHeaders['User-Agent'] = getUserAgentForApp(details.url, session.getUserAgent());
        details.referrer = getRefererForApp(details.referrer);
        details.requestHeaders['Referer'] = details.referrer;

        callback({ 
            cancel: false, 
            requestHeaders: details.requestHeaders 
        });
      }
  );
}