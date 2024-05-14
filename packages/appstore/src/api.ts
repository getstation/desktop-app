export const findApplicationByName = (applicationName: string) => {

  if ('bxApi' in window) {
    const bxApi = window.bxApi;

    return bxApi.applications.search(applicationName).then(({ body }) => {
      return body || [];
    });
  }

  return Promise.resolve([]);
};
