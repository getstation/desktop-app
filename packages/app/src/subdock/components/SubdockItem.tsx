import * as React from 'react';
import Maybe from 'graphql/tsutils/Maybe';
import { getHighlightGradient, Icon, IconSymbol, roundedBackground, ThemeTypes as Theme } from '@getstation/theme';
import * as classNames from 'classnames';
// @ts-ignore: no declaration file
import * as isBlank from 'is-blank';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

import AppIcon from '../../dock/components/AppIcon';

import SubdockButton from './SubdockButton';

// STYLE

type OwnStyle = {
  item: string,
  iconWrapper: string,
  iconWrapperActive: string,
  txt: string,
  favoriteIcon: string,
  favoriteIconWrapper: string,
  favoriteImg: string,
  link: string,
  buttons: string,
  unPinned: string,
};

export const SUBDOCK_ITEM_HEIGHT = 40;

const styles = (theme: Theme) => ({
  item: {
    padding: '0 20px 0 15px',
    borderBottom: '2px solid rgba(255,255,255,0.1)',
    listStyleType: 'none',
    '&:hover': {
      backgroundImage: getHighlightGradient(undefined, .30),
    },
    '&.isActive': {
      backgroundImage: getHighlightGradient(undefined, .50),
    },
    '&:last-child': {
      borderBottom: 'none',
    },
    '& $buttons': {
      display: 'none',
    },
    '&:hover $buttons': {
      display: 'flex',
    },
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'default',
    height: SUBDOCK_ITEM_HEIGHT,
    position: 'relative',
    borderBottom: '1px solid rgba(white, 0.15)',
  },
  favoriteIcon: {
    opacity: 0.4,
    '&:hover': {
      opacity: 0.7,
    },
    '$item.isActive &, $item.favorite &': {
      opacity: 1,
    },
  },
  favoriteImg: {
    flex: '0 0 auto',
    marginRight: '9px',
    opacity: 1,
    borderRadius: '8px',
    filter: 'grayscale(100%)',
    '$link:hover &': {
      filter: 'grayscale(30%)',
    },
    '$item.isActive &': {
      filter: 'grayscale(0)',
    },
  },
  txt: {
    color: 'white',
    flex: '1 1 auto',
    marginRight: '5px',
    position: 'relative',
    opacity: 0.8,
    ...theme.elipsisMixin(1),
    ...theme.fontMixin(13),
    '$item.isActive &': {
      opacity: 1,
      ...theme.fontMixin(13, 700),
    },
  },
  iconWrapper: {
    width: 24,
    height: 24,
    opacity: 0.8,
    display: 'inline-flex',
    marginLeft: '-8px',
    '$item.isActive &': {
      opacity: 1,
    },
  },
  favoriteIconWrapper: {
    width: 24,
    height: 24,
    marginLeft: '-3px',
    marginRight: '5px',
    display: 'inline-flex',
    '&:hover': {
      ...roundedBackground('rgba(255,255,255,0.2)'),
    },
    '$item.favorite &': {
      ...roundedBackground('#EFC657'),
    },
  },
  buttons: {
  },
  unPinned: {
    transform: 'rotate(45deg)',
  },
});

// PROPS

export interface MinimalSubdockApplication {
  id: string,
  iconUrl: Maybe<string>,
  themeColor: Maybe<string>,
}

export interface WrappedActions {
  onSelect: () => any,
  onClose: () => any,
  onClickFavorite: () => any,
  onClickAttach?: () => any,
  onClickDetach: () => any,
}

export interface ItemDetails {
  title: string,
  isActive: boolean,
  isTabApplicationHome: boolean,
  isDetached: boolean,
  icon?: string | null,
  noClose?: boolean,
  canPin?: boolean,
  canDetach?: boolean,
  isPinned?: boolean,
}

interface OwnProps {
  application: MinimalSubdockApplication,
  actions: WrappedActions,
  item: ItemDetails,
}

// EMPTY SUBDOCK ELEMENT

const emptySubdockItemStyle = { height: SUBDOCK_ITEM_HEIGHT };
export const EmptySubdockItem = () => (
  <div style={emptySubdockItemStyle} />
);

// FULL SUBDOCK ELEMENT

const SubdockItem = (props: OwnProps & { classes: OwnStyle }) => {
  const { application, actions, item, classes } = props;

  const {
    title, icon,
    isActive, isTabApplicationHome, isPinned, isDetached,
    canPin, canDetach, noClose,
  } = item;

  const {
    onSelect, onClose, onClickPin,
    onClickDetach, onClickAttach,
  } = useEventWrapper(actions);

  const { iconUrl, themeColor } = application;

  return (
    <li className={classNames(classes!.item, { isActive })}>
      <a className={classes!.link} onClick={onSelect}>
        {isTabApplicationHome && iconUrl &&
          <div className={classes!.favoriteImg}>
            <AppIcon
              imgUrl={iconUrl}
              themeColor={themeColor || undefined}
              size={16}
            />
          </div>
        }

        {icon &&
          <span className={classes!.iconWrapper}>
            <Icon size={24} color="white" symbolId={icon as IconSymbol} />
          </span>
        }

        <span className={classes!.txt}>
          {isBlank(title) ? <i>Untitled</i> : title}
        </span>

        <span className={classes!.buttons}>
          {canPin &&
            <SubdockButton
              className={isPinned ? '' : classes!.unPinned}
              tooltip={isPinned ? 'Unpin this page' : 'Pin this page'}
              size={24}
              symbolId={IconSymbol.PIN}
              onClick={onClickPin}
            />
          }

          { canDetach &&
            <SubdockButton
              tooltip={isDetached ? 'Reattach the window' : 'Open in detached window'}
              size={24}
              symbolId={isDetached ? IconSymbol.REATTACH : IconSymbol.DETACH}
              onClick={isDetached ? onClickAttach : onClickDetach}
            />
          }

          {!noClose && <SubdockButton
            tooltip="Close this page"
            size={24}
            symbolId={IconSymbol.CROSS}
            onClick={onClose}
          />}
        </span>
      </a>
    </li>
  );
};

// HOOKS

const useEventWrapper = (actions: WrappedActions) => {
  return React.useMemo(
    () => {
      const onSelect = (_: React.MouseEvent<Element>) => {
        actions.onSelect();
      };

      // close being inside the whole item, need to stop propagation
      // so that onSelect is not called
      const onClose = (e: React.MouseEvent<Element>) => {
        e.stopPropagation();
        actions.onClose();
      };

      const onClickPin = (e: React.MouseEvent<Element>) => {
        e.stopPropagation();
        actions.onClickFavorite();
      };

      const onClickDetach = (e: React.MouseEvent<Element>) => {
        e.stopPropagation();
        actions.onClickDetach();
      };

      const onClickAttach = (e: React.MouseEvent<Element>) => {
        e.stopPropagation();
        if (actions.onClickAttach) actions.onClickAttach();
      };

      return {
        onSelect,
        onClose,
        onClickPin,
        onClickDetach,
        onClickAttach,
      };
    },
    [actions],
  );
};

// EXPORT

export default injectSheet(styles)(SubdockItem) as React.ComponentType<OwnProps>;
