const fetchMethod = ((global as any).fetch) ? fetch : require('node-fetch').default;

/**
 * Like fetch, but only for calls that return JSON.
 * Throws an error if the returned JSON contains an `error` key.
 */
export const jsonFetch = (requestedUrl: string, init?: RequestInit) =>
  fetchMethod(requestedUrl, init)
    .then((res: Response) => res.json())
    .then((asJson: any) => {
      return asJson;
    });

export const getBody = <T>(body: T) => {
  return {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  };
};
