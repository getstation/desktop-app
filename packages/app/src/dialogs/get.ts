import { DialogItemImmutable, ExtendedDialogItemImmutable } from './types';

import { ApplicationImmutable } from '../applications/types';

export const getDialogId = (dialog: DialogItemImmutable) => dialog.get('id');

export const getDialogTitle = (dialog: DialogItemImmutable) =>
  dialog.get('title');

export const getDialogMessage = (dialog: DialogItemImmutable) =>
  dialog.get('message');

export const getDialogTabId = (dialog: DialogItemImmutable) => dialog.get('tabId');

export const getDialogActions = (dialog: DialogItemImmutable) => dialog.get('actions').toJS();

export const getDialogApplication = (dialog: ExtendedDialogItemImmutable): ApplicationImmutable | undefined =>
  dialog.get('application');
