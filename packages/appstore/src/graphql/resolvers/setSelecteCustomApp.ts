import { Application } from '@src/graphql/queries';

export interface SetSelectedCustomApp {
  app: Application,
}

export default (_: any, { app }: SetSelectedCustomApp, { cache }: any) => {
  const newSelectedCustomApp = {
    app: {
      ...app,
      category: {
        ...app.category,
        __typename: 'ApplicationCategory',
      },
      __typename: 'Application',
    },
    __typename: 'SelectedCustomApp',
  };
  const data = { selectedCustomApp: newSelectedCustomApp };

  cache.writeData({ data });
  return cache.data.selectedCustomApp;
};
