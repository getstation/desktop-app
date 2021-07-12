import { Application, Tab, HomeTab, Favorite } from '../../types';

export { Application, Tab, HomeTab, Favorite };

export type ITabSelectedInfo = {
  isHome: boolean,
  isFavorite: boolean,
};

export type SubdockActionsProps = {
  onSelectTab: (tabId: string, tabSelectedInfo: ITabSelectedInfo) => any,
  onDetachTab: (tabId: string) => any,
  onAttachTab: (tabId: string) => any,
  onSelectFavorite: (favoriteId: string) => any,
  onAddTabAsFavorite: (tabId: string) => any,
  onRemoveFavorite: (favoriteId: string, tabId: string) => any,
  onDetachFavorite: (favoriteId: string) => any,
  onCloseTab: (tabId: string) => any,
};

export type SubdockItemActionProps = {
  onSelect: () => void,
  onClose: () => void,
  onClickFavorite: () => void,
  onClickAttach: () => void,
  onClickDetach: () => void,
};
