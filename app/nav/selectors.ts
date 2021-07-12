import { StationState } from '../types';

export const getNav = (state: StationState) => state.get('nav');

/**
 * @deprecated Should be renamed to getMainWindowActiveApplicationId
 */
export const getActiveApplicationId = (state: StationState) => state.getIn(['nav', 'tabApplicationId']);

/**
 * @deprecated Should be renamed to getMainWindowPreviousActiveApplicationId
 */
export const getPreviousActiveApplicationId = (state: StationState) => state.getIn(['nav', 'previousTabApplicationId']);
