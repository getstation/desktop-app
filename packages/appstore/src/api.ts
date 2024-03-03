export const findApplicationByName = (applicationName: string) => {

  if ('bx' in window) {
    const bxApi = window.bx;

    return bxApi.applications.search(applicationName).then(({ body }) => {
      return body || [];
    });
  }

  return Promise.resolve([]);
};
