import { IMenuServiceObserverOnClickItemParam } from './interface';

export const serializedKeyboardEvent = (
  event: Electron.KeyboardEvent
): IMenuServiceObserverOnClickItemParam['event'] => {
  const { ctrlKey, shiftKey, altKey, triggeredByAccelerator } = event;
  return { ctrlKey, shiftKey, altKey, triggeredByAccelerator };
};
