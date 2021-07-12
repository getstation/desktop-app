export interface SetAppModalStatus {
  isAppModalOpen: boolean,
}

export default (_: any, { isAppModalOpen }: SetAppModalStatus, { cache }: any) => {
  const newAppModalStatus = {
    isAppModalOpen: isAppModalOpen,
    __typename: 'AppModalStatus',
  };
  const data = { appModalStatus: newAppModalStatus };
  cache.writeData({ data });
  return cache.data.appModalStatus;
};
