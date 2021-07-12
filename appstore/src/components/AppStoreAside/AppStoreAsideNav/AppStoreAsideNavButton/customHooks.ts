import * as React from 'react';

import {
  useSetSearchStringMutation,
  useSetCustomAppRequestModeMutation,
  useSetBurgerStatusMutation,
} from './queries.gql.generated';

export const useAppStoreAsideNavButtonOnClick = () => {
  const [setSearchString] = useSetSearchStringMutation();
  const [setCustomAppRequestMode] = useSetCustomAppRequestModeMutation();
  const [setBurgerStatus] = useSetBurgerStatusMutation();

  return React.useCallback(async () => {
    await Promise.all([
      setSearchString({
        variables: { searchString: '', searchStringAfterEnterPress: '', isEnterPressed: false },
      }),
      setCustomAppRequestMode({
        variables: { appRequestIsOpen: false, currentMode: '' },
      }),
      setBurgerStatus({ variables: { isBurgerOpen: false } }),
    ]);
  }, [setSearchString, setCustomAppRequestMode, setBurgerStatus]);
};
