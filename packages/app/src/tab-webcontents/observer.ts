import { Dispatch } from 'redux';
import { observer } from 'redux-observers';
import { getFrontActiveTabId } from '../applications/utils';
import { frontActiveTabChange, FrontActiveTabChangeAction } from './duck';

const observeActiveTabChange = observer(getFrontActiveTabId,
  (dispatch: Dispatch<FrontActiveTabChangeAction>, activeTabId: string | null, previousActiveTabId: string | null) => {
    if (!activeTabId) return;
    dispatch(frontActiveTabChange(activeTabId, previousActiveTabId));
  });

export default [
  observeActiveTabChange,
];
