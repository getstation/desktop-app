import { StationState } from '../types';

export const getSubdockApplicationId = (state: StationState) : string | null => state.getIn(['subdock', 'applicationId'], null);
