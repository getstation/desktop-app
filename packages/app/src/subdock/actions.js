import { setHoverElement, setVisibleState } from './duck';
import { getHoverElement } from './selectors';

export const setHoverElementAndComputeVisibleState = (hoverElement, isOver) => (dispatch, getState) => {
  const state = getState();
  const prevOverElement = getHoverElement(state);
  let isVisible = isOver;
  if (!isOver && prevOverElement === 'icon' && hoverElement === 'subdock') {
    isVisible = true;
  }
  dispatch(setHoverElement(hoverElement));
  dispatch(setVisibleState(isVisible));
};
