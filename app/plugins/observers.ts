import * as Immutable from 'immutable';
import { Dispatch } from 'redux';
// @ts-ignore: no declaration file
import { observer } from 'redux-observers';
import { getInstalledManifestURLs } from '../applications/selectors';
import { activateService } from './duck';

const observeAppsInstalled = observer(
  getInstalledManifestURLs,
  (dispatch: Dispatch<any>, URLs: string[], previousURLs: string[]) => {

    const URLSet = Immutable.Set(URLs);
    const previousURLSet = Immutable.Set(previousURLs);

    URLSet.subtract(previousURLSet).forEach((manifestURL) => {
      if (manifestURL) dispatch(activateService(manifestURL));
    });
  });

export default [
  observeAppsInstalled,
];
