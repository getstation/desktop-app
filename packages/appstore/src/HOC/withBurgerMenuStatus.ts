import { graphql } from 'react-apollo';
import { IS_BURGER_OPEN } from '@src/graphql/schemes/burgerMenu';

export type GetBurgerMenuStatusResponse = {
  isBurgerOpen: {
    value: boolean,
  },
};

export type WithBurgerMenuStatus = {
  isBurgerOpen?: boolean,
};

export default graphql<{}, GetBurgerMenuStatusResponse, {}, WithBurgerMenuStatus>(IS_BURGER_OPEN, {
  props: ({ data }) => ({
    isBurgerOpen: data!.isBurgerOpen!.value,
  }),
});
