import gql from 'graphql-tag';

export const IS_BURGER_OPEN = gql`
  query {
    isBurgerOpen @client {
      value
    }
  }
`;

export const SET_BURGER_STATUS = gql`
  mutation SetBurgerStatus($isBurgerOpen: Boolean!) {
    setBurgerStatus(isBurgerOpen: $isBurgerOpen) @client {
      isBurgerOpen
    }
  }
`;
