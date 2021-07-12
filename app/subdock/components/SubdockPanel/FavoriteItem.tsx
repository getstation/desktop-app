import * as React from 'react';

import DraggableSubdockItem from '../DraggableSubdockItem';
import { MinimalSubdockApplication, WrappedActions } from '../SubdockItem';

import { Favorite } from './types';
import { RawFavoriteActions } from './Favorites';

// PROPS

interface OwnProps {
  application: MinimalSubdockApplication,
  index: number,
  item: Favorite,
  isActive: boolean,
  actions: RawFavoriteActions,
}

// COMPONENT

const FavoriteItem = (props: OwnProps) => {
  const {
    item, application,
    index, isActive,
    actions,
  } = props;

  const surchargedItem = useSanitization(item, isActive);
  const wrappedActions = useActionsWrapper(actions, item);

  return (
    <DraggableSubdockItem
      index={index}
      dragType={'DND_SUBDOCK_ITEM_FAVORITES'}
      application={application}
      tabId={item.favoriteId!}
      item={surchargedItem}
      favorite={true}
      actions={wrappedActions}
    />
  );
};

// HOOKS

/**
 * Transform received Favorite (+ various options) into an item shapped for SubdockItem.
 */
const useSanitization = (item: Favorite, isActive: boolean) => {
  return React.useMemo(
    () => {
      const { relatedTab } = item;
      return {
        title: item.title || '',
        isActive,
        isTabApplicationHome: false,
        isDetached: (relatedTab) ? Boolean(relatedTab.isDetached) : false,
        icon: (relatedTab) ? relatedTab.specificIconId : undefined,
        canPin: true,
        canDetach: true,
        isPinned: true,
        noClose: false,
      };
    },
    [item, isActive],
  );
};

/**
 * Wrap the given actions with the Id of the current item (and related options) so it can be
 * straightforwardly used by a SubdockItem.
 */
const useActionsWrapper = (
  actions: RawFavoriteActions,
  item: Favorite,
): WrappedActions => {
  return React.useMemo(
    () => {
      const { favoriteId, relatedTab } = item;
      if (!favoriteId) throw new Error('Missing Favorite ID to wrap actions');

      const payloadId = { variables: { id: favoriteId } };

      return {
        onSelect: () => actions.onSelect(payloadId),
        onClose: () => actions.onClose(payloadId),
        onClickFavorite: () => actions.onClickFavorite(payloadId),
        onClickAttach: () => actions.onClickAttach(relatedTab.id),
        onClickDetach: () => actions.onClickDetach(payloadId),
      };
    },
    [actions, item],
  );
};

// EXPORT

export default FavoriteItem as React.ComponentType<OwnProps>;
