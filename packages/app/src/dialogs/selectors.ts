import * as Immutable from 'immutable';
import { createSelector } from 'reselect';
import { getApplications } from '../applications/selectors';
import { ApplicationsImmutable } from '../applications/types';
import { getTabApplicationId } from '../tabs/get';
import { getTabs } from '../tabs/selectors';
import { StationTabsImmutable } from '../tabs/types';
import { StationState } from '../types';
import { getDialogTabId } from './get';
import { DialogItemImmutable, DialogItemsImmutable, ExtendedDialogItemsImmutable } from './types';

export const getDialogs = (state: StationState) =>
  state.get('dialogs');

export const getExtendedDialogs = createSelector(
  getDialogs, getTabs, getApplications,
  (
    dialogs: DialogItemsImmutable,
    tabs: StationTabsImmutable,
    applications: ApplicationsImmutable
  ): ExtendedDialogItemsImmutable => dialogs
    .map((dialog: DialogItemImmutable) => {
      const tab = tabs.get(getDialogTabId(dialog));
      if (!tab) return dialog;

      const application = applications.get(getTabApplicationId(tab));
      if (!application) return dialog;

      return dialog.merge(Immutable.Map({
        tab,
        application,
      })) as any;
    })
    .filter(Boolean)
);
