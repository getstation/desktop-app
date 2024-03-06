import * as React from 'react';

import DraggableSubdockItem from '../DraggableSubdockItem';
import { EmptySubdockItem, MinimalSubdockApplication, WrappedActions } from '../SubdockItem';

import { Tab } from './types';
import { RawTabActions } from './Tabs';
import { VisibleItems } from './customHooks';

// PROPS

interface OwnProps {
  visibleItems: VisibleItems,
  application: MinimalSubdockApplication,
  index: number,
  item: Tab,
  isActive: boolean,
  actions: RawTabActions,
}

// COMPONENT

const TabItem = (props: OwnProps) => {
  const {
    item, application,
    index, isActive, visibleItems,
    actions,
  } = props;

  const surchargedItem = useSanitization(item, isActive);
  const wrappedActions = useActionsWrapper(actions, item);

  if (index < visibleItems.firstIndex || index > visibleItems.lastIndex) {
    return (<EmptySubdockItem />);
  }

  return (
    <DraggableSubdockItem
      index={index}
      dragType={'DND_SUBDOCK_ITEM_TABS'}
      application={application}
      tabId={item.tabId!}
      item={surchargedItem}
      favorite={false}
      actions={wrappedActions}
    />
  );
};

// HOOKS

/**
 * Transform received Tab (+ various options) into an item shapped for SubdockItem.
 */
const useSanitization = (item: Tab, isActive: boolean) => {
  return React.useMemo(
    () => ({
      title: item.title || '',
      isActive,
      isTabApplicationHome: Boolean(item.isApplicationHome),
      isDetached: Boolean(item.isDetached),
      icon: item.specificIconId,
      canPin: true,
      canDetach: true,
      isPinned: false,
      noClose: false,
    }),
    [item, isActive],
  );
};

/**
 * Wrap the given actions with the Id of the current item (and related options) so it can be
 * straightforwardly used by a SubdockItem.
 */
export const useActionsWrapper = (
  actions: RawTabActions,
  item: Tab,
): WrappedActions => {
  return React.useMemo(
    () => ({
      onSelect: () => actions.onSelect(item.tabId!, { isFavorite: false, isHome: Boolean(item.isApplicationHome) }),
      onClose: () => actions.onClose(item.tabId!),
      onClickFavorite: () => actions.onClickFavorite(item.tabId!),
      onClickAttach: () => actions.onClickAttach(item.tabId!),
      onClickDetach: () => actions.onClickDetach(item.tabId!),
    }),
    [actions, item],
  );
};

// EXPORT

export default TabItem as React.ComponentType<OwnProps>;
