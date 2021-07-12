import { observer } from 'redux-observers';
import { getFocus } from './selectors';
import GenericWindowManager from '../windows/utils/GenericWindowManager';

const appFocus = observer(
  state => getFocus(state),
  (dispatch, focus, previousFocus) => {
    if (focus === previousFocus) return;
    if (typeof focus !== 'number') return;
    GenericWindowManager.focus(focus);
  }
);


export default [
  appFocus
];
