export interface SetBurgerStatusVariables {
  isBurgerOpen: boolean,
}

export default (_: any, { isBurgerOpen }: SetBurgerStatusVariables, { cache }: any) => {
  const newBurgerIsOpen = { value: isBurgerOpen, __typename: 'IsBurgerOpen' };
  const data = { isBurgerOpen: newBurgerIsOpen };
  cache.writeData({ data });
  return cache.data.isBurgerOpen;
};
