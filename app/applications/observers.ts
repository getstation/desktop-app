import * as Immutable from 'immutable';
// @ts-ignore no declaration file
import { observer } from 'redux-observers';
import { Dispatch } from 'redux';

import {
  getInstalledApplicationsIdsAsSetWithoutNonInstallables,
} from './selectors';
import { remoteUpdateInstalledApplications } from './duck';

/**
 * observe the change of installed applicationIds and dipatch the appropriate action to update
 * the list of services installed in the API.
 *
 * Use selector `getInstalledApplicationsIdsAsSetWithoutNonInstallables` that returns an Immutable.Set (collection of
 * unique values) which "equality" can be tested via `Immutable.is`.
 */
const observeServicesInstalled = observer(getInstalledApplicationsIdsAsSetWithoutNonInstallables,
  (dispatch: Dispatch<any>) => dispatch(remoteUpdateInstalledApplications()),
  {
    // Immutable.is will treat Sets equlity better than JS native ===
    equals: Immutable.is,
  }
);

export default [
  observeServicesInstalled,
];
