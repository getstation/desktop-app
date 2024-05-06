import { combineReducers } from 'redux';

import appRequest from '../app-request/duck';

const rootReducer = combineReducers({
  appRequest,
});

export default rootReducer;
