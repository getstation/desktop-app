import { Session, OnBeforeSendHeadersListenerDetails, OnHeadersReceivedListenerDetails, 
          HeadersReceivedResponse, BeforeSendResponse } from 'electron';
import enhanceWebRequest from 'electron-better-web-request';

const defaultUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.289 Safari/537.36';

const getUserAgentForApp = (url: string, currentUserAgent: string): string => {

  if (url.startsWith('file://') || url.startsWith('http://localhost')) {
    return currentUserAgent;
  }
  else if (url.startsWith('https://accounts.google.com')) {
    return 'Chrome/87.0.4280.141';
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