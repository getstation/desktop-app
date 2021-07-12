import { StationState } from '../types';

export const getSubwindows = (state: StationState) => state.get('subwindows');

export const hasSubwindow = (state: StationState, tabId: string) => getSubwindows(state).has(tabId);
