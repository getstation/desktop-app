import { State } from '@src/state';

export const getAppRequest = (state: State) => state.appRequest;

export const getApiResponse = (state: State) => getAppRequest(state).apiResponse;

export const getApplicationCreated = (state: State) => getAppRequest(state).applicationCreated;
