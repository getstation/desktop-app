
import * as Immutable from 'immutable';
import { createSelector } from 'reselect';
import * as path from 'path';

const getDownloadsToShow = createSelector(
  [
    state => state.get('downloads'),
    state => state.get('dlToaster')
  ],
  (downloads, dlToaster) => downloads.filter(dl => dlToaster.has(dl.get('downloadId')))
);


export const getFormatedDownloadsToShow = createSelector(
  [
    getDownloadsToShow,
  ],
  (downloads) => downloads
    .toList()
    .map(dl => dl.merge(Immutable.Map({
      filename: path.basename(dl.get('filePath')),
      completionPercent: dl.get('progressRate') * 100,
      applicationId: dl.get('applicationId'),
    })))
);
