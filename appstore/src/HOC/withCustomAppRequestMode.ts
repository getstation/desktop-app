import { graphql } from 'react-apollo';
import { GET_CUSTOM_APP_REQUEST_MODE } from '@src/graphql/schemes/customAppRequestMode';

export type GetCustomAppRequestModeResponse = {
  appRequestMode: {
    appRequestIsOpen: boolean,
    currentMode: string,
  },
};

export type WithCustomAppRequestModeStatus = {
  appRequestIsOpen: boolean,
  currentMode: string,
};

export default graphql<{}, GetCustomAppRequestModeResponse, {}, WithCustomAppRequestModeStatus>(GET_CUSTOM_APP_REQUEST_MODE, {
  props: ({ data }) => ({
    appRequestIsOpen: data!.appRequestMode!.appRequestIsOpen,
    currentMode: data!.appRequestMode!.currentMode,
  }),
});
