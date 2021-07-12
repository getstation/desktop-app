import { Dispatch } from 'redux';
// @ts-ignore: no declaration file
import { observer } from 'redux-observers';
import { logger } from '../api/logger';
import { StationState } from '../types';

const observeDockDuplicates = observer(
  (state: StationState) => state.get('dock'),
  (_dispatch: Dispatch<any>, state: StationState, previousState: StationState | undefined) => {
    if (state === previousState) return;
    if (state.toSet().size === state.size) return;
    logger.notify(new Error('Duplicate entries in dock'), {
      metaData: {
        dock: state.toJS(),
        previousDock: previousState ? previousState.toJS() : undefined,
      },
    });
  },
  { skipInitialCall: false }
);

export default [
  observeDockDuplicates,
];
