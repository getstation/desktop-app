import { IconSymbol, Style } from '@getstation/theme';

import { StationApplication } from '../applications/types';
import { StationTab } from '../tabs/types';

import { RecursiveImmutableMap } from '../types';

export type DialogItemAction = {
  onClick: string,
  icon?: IconSymbol,
  text?: string,
  style?: Style,
};

export type DialogItem = {
  id: string,
  title: string,
  message: string,
  tabId: string,
  actions: DialogItemAction[],
};

export type DialogItems = Partial<Record<
  DialogItem['id'], DialogItem>
>;

export type DialogItemsImmutable = RecursiveImmutableMap<DialogItems>;

export type DialogItemImmutable = RecursiveImmutableMap<DialogItem>;

export type ExtendedDialogItem = DialogItem & { tab?: StationTab, application?: StationApplication };

export type ExtendedDialogItems = Record<
  ExtendedDialogItem['id'], ExtendedDialogItem
>;

export type ExtendedDialogItemsImmutable = RecursiveImmutableMap<ExtendedDialogItems>;

export type ExtendedDialogItemImmutable = RecursiveImmutableMap<ExtendedDialogItem>;
