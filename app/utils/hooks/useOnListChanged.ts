import { equals, difference } from 'ramda';
import { usePrevious } from './usePreviousVal';

type OnListChangedHandlers<T> = {
  onAdd: (prevList: T[], diff: T[]) => void;
  onRemove: (prevList: T[], diff: T[]) => void;
  onUpdate: (prevList: T[]) => void;
};

const defaultOnListChangedHandlers: OnListChangedHandlers<any> = {
  onAdd: () => {},
  onRemove: () => {},
  onUpdate: () => {},
};

/**
 * Execute sended callbacks (onAdd,onRemove, onUpdate) when previous&current lists are differents
 */
function useOnListChanged<T>(list: T[] = [], pHandlers: Partial<OnListChangedHandlers<T>>) {

  if (!list) return;

  const handlers: OnListChangedHandlers<T> = {
    ...defaultOnListChangedHandlers,
    ...pHandlers,
  };
  const prevList = usePrevious(list, []);

  // Value are equals, nothing to do
  if (equals(prevList, list)) return;

  // ☣️ order of element in difference function is important
  const diff = difference(list, prevList);

  if (list.length > prevList.length) {
    return setImmediate(() => handlers.onAdd(prevList, diff));
  } else if (list.length < prevList.length) {
    return setImmediate(() => handlers.onRemove(prevList, diff));
  }
  // Default one when just values inside has changed
  setImmediate(() => handlers.onUpdate(prevList));
}

export { useOnListChanged };
