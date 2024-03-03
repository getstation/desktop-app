export interface SetCustomAppRequestMode {
  appRequestIsOpen: boolean,
  currentMode: string,
}

export default (_: any, { appRequestIsOpen, currentMode }: SetCustomAppRequestMode, { cache }: any) => {
  const newCustomAppRequestMode = {
    appRequestIsOpen: appRequestIsOpen,
    currentMode: currentMode,
    __typename: 'AppRequestMode',
  };
  const data = { appRequestMode: newCustomAppRequestMode };
  cache.writeData({ data });
  return cache.data.appRequestMode;
};
