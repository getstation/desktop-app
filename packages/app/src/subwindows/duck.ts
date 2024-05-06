import * as Immutable from 'immutable';
import { StationSubWindowsImmutable } from './types';

/**
 * -------------
 * - PERSISTED -
 * -------------
 */

export const DETACH = 'browserX/subwindows/DETACH';
export type DETACH = 'browserX/subwindows/DETACH';
export const ATTACH = 'browserX/subwindows/ATTACH';
export type ATTACH = 'browserX/subwindows/ATTACH';

export type DetachAction = { type: DETACH, tabId: string };
export type AttachAction = { type: ATTACH, tabId: string };

export type SubwindowsActions =
  DetachAction |
  AttachAction;

export const detach = (tabId: string): DetachAction => ({
  type: DETACH, tabId,
});

export const attach = (tabId: string): AttachAction => ({
  type: ATTACH, tabId,
});

export default function subwindows(state: StationSubWindowsImmutable = Immutable.Set(), action: SubwindowsActions) {
  switch (action.type) {

    case DETACH: {
      const { tabId } = action;
      return state.add(tabId);
    }

    case ATTACH: {
      const { tabId } = action;
      return state.delete(tabId);
    }

    default:
      return state;
  }
}
