export interface SetActiveScreenNameVariables {
  activeScreenName: string,
}

export default (_: any, { activeScreenName }: SetActiveScreenNameVariables, { cache }: any) => {
  const newActiveScreenName = { value: activeScreenName, __typename: 'ActiveScreenName' };
  const data = { activeScreenName: newActiveScreenName };
  cache.writeData({ data });
  return cache.data.activeScreenName;
};
