import { COLORS, Coordinates } from '@getstation/theme';
import * as Immutable from 'immutable';

// Constants
export type CHANGE_THEME_COLORS = 'browserX/theme/CHANGE_THEME_COLORS';
export const CHANGE_THEME_COLORS = 'browserX/theme/CHANGE_THEME_COLORS';
export type SET_CURRENT_LOCATION = 'browserX/theme/SET_CURRENT_LOCATION';
export const SET_CURRENT_LOCATION = 'browserX/theme/SET_CURRENT_LOCATION';
export type BEGIN_COLORS_TRANSITION = 'browserX/theme/BEGIN_COLORS_TRANSITION';
export const BEGIN_COLORS_TRANSITION = 'browserX/theme/BEGIN_COLORS_TRANSITION';
export type JUMP_COLORS_TRANSITION = 'browserX/theme/JUMP_COLORS_TRANSITION';
export const JUMP_COLORS_TRANSITION = 'browserX/theme/JUMP_COLORS_TRANSITION';

export type ChangeThemeColorsAction = { type: CHANGE_THEME_COLORS, colors: string[] };
export type SetCurrentLocationAction = { type: SET_CURRENT_LOCATION, coords: Coordinates };
export type BeginColorsTransition = {
  type: BEGIN_COLORS_TRANSITION,
  fromMoment: string,
  toMoment: string,
  ratio?: number
  jump?: boolean,
};
export type JumpColorsTransition = {
  type: JUMP_COLORS_TRANSITION,
  fromColors: string[],
  toColors: string[],
};
export type ThemeActions =
ChangeThemeColorsAction
  | SetCurrentLocationAction
  | BeginColorsTransition
  | JumpColorsTransition;

// Actions creators
export const changeThemeColors = (colors: string[]): ChangeThemeColorsAction => ({
  type: CHANGE_THEME_COLORS,
  colors,
});

export const setCurrentLocation = (coords: Coordinates): SetCurrentLocationAction => ({
  type: SET_CURRENT_LOCATION,
  coords,
});

export const beginColorTransition = (
  fromMoment: string,
  toMoment: string,
  ratio?: number,
  jump: boolean = false,
): BeginColorsTransition => ({
  type: BEGIN_COLORS_TRANSITION,
  fromMoment,
  toMoment,
  ratio,
  jump,
});

export const jumpColorTransition = (fromColors: string[], toColors: string[]): JumpColorsTransition => ({
  type: JUMP_COLORS_TRANSITION,
  fromColors,
  toColors,
});

// Reducer
const DEFAULT_MAP: Immutable.Map<string, any> = Immutable.Map({
  colors: Immutable.List(COLORS.get('morning').colors),
});

export default function reducer(state: typeof DEFAULT_MAP = DEFAULT_MAP, action: ThemeActions) {
  switch (action.type) {

    case CHANGE_THEME_COLORS:
      return state.set('colors', Immutable.List(action.colors));

    case SET_CURRENT_LOCATION:
      return state.set('coords', Immutable.Map(action.coords));

    default:
      return state;
  }
}
