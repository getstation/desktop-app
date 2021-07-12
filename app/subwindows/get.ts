import { StationSubWindowsImmutable } from './types';

export const hasSubwindowsTabId = (subwindows: StationSubWindowsImmutable, tabId: string): boolean =>
  subwindows.has(tabId);
