// @ts-ignore: no declaration file
import { observer } from 'redux-observers';
import { handleError } from '../services/api/helpers';
import { StationState } from '../types';
import SubWindowManager from '../windows/utils/SubWindowManager';
import { getSubwindows } from './selectors';
import { StationSubWindowsImmutable } from './types';

const subwindowsObserver = observer(
  (state: StationState) => getSubwindows(state),
  (_dispatch: any, subwindows: StationSubWindowsImmutable, previousSubwindows: StationSubWindowsImmutable) => {
    if (subwindows === previousSubwindows) return;
    const windowsToAdd = subwindows.subtract(previousSubwindows);
    const windowsToRemove = previousSubwindows.subtract(subwindows);

    for (const tabId of windowsToAdd.toArray()) {
      SubWindowManager.new(tabId).catch(handleError());
    }

    for (const tabId of windowsToRemove.toArray()) {
      SubWindowManager.hideAndCloseAfterReattach(tabId).catch(handleError());
    }
  }
);

export default [subwindowsObserver];
