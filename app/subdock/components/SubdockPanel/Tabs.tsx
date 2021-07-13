import * as React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import mergeRefs from 'react-merge-refs';
import classNames from 'classnames';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { IconSymbol } from '@getstation/theme';

import { MinimalSubdockApplication } from '../SubdockItem';
import { ActiveTab } from '../../Container';
import SubdockButton from '../SubdockButton';

import { Tab, SubdockActionsProps } from './types';
import {
  useScrollToActiveTabOnMount,
  useScrollData,
  IdentifierType,
} from './customHooks';
import { SubdockListStyle, subdockListStyle } from './styles';
import TabItem from './TabItem';

// CUSTOM STYLE

interface OwnStyle {
  newPageButton: string,
}

const ownStyle = {
  newPageButton: {
    marginRight: '20px',
    opacity: .4,
  },
};

// PROPS

export interface RawTabActions {
  onSelect: SubdockActionsProps['onSelectTab'],
  onClose: SubdockActionsProps['onCloseTab'],
  onClickFavorite: SubdockActionsProps['onAddTabAsFavorite'],
  onClickAttach: SubdockActionsProps['onAttachTab']
  onClickDetach: SubdockActionsProps['onDetachTab'],
}

export type OwnProps = SubdockActionsProps & {
  ref?: React.Ref<HTMLDivElement>,
  className?: string,
  application: MinimalSubdockApplication,
  tabs: Tab[],
  activeTab: ActiveTab,
  handleOpenNewTab: () => void,
};

// COMPONENT

const Tabs = React.forwardRef((
  {
    classes,
    className,
    application,
    tabs,
    activeTab,
    handleOpenNewTab,
    ...props
  }: OwnProps & { classes: SubdockListStyle & OwnStyle },
  ref: React.Ref<HTMLDivElement>
) => {
  // Scroll Stuff
  const internalRef = useScrollToActiveTabOnMount(tabs, activeTab.id, IdentifierType.Tab);
  const { onScroll, scrolled, visibleItems } = useScrollData();

  // Vars & other init
  const actions = extractTabActions(props);

  const nbTabs = tabs.length;
  if (nbTabs === 0) return null;

  return (
    <div className={classes!.container}>
      <div className={classes!.sectionHeader}>
        <p className={classes!.title}>
          Opened pages
          {nbTabs > 5 && <span> : {nbTabs}</span>}
        </p>
        <SubdockButton
          tooltip={'Open a new page'}
          className={classes!.newPageButton}
          size={24}
          symbolId={IconSymbol.PLUS}
          onClick={handleOpenNewTab}
        />
      </div>
      <div
        ref={mergeRefs([ref, internalRef])}
        onScroll={onScroll}
        className={classNames(
          className,
          classes.content,
          {
            [classes.scrollOverlayTop]: !scrolled.top && nbTabs > 5,
            [classes.scrollOverlayBottom]: !scrolled.bottom && nbTabs > 5,
          }
        )}
      >
        <ul>
          <TransitionGroup>
            {tabs.map((item, index) =>
            <CSSTransition
              key={item.tabId!}
              classNames="all-read-animation"
              timeout={{ enter: 700, exit: 500 }}
            >
              <TabItem
                actions={actions}
                application={application}
                item={item}
                index={index}
                visibleItems={visibleItems}
                isActive={item.tabId === activeTab.id}
              />
            </CSSTransition>
            )}
          </TransitionGroup>
        </ul>
      </div>
    </div>
  );
});

// UTILS

/**
 * Get only the necessary actions from props to be used by Tabs.
 */
export const extractTabActions = (props: SubdockActionsProps): RawTabActions => {
  return {
    onSelect: props.onSelectTab,
    onClose: props.onCloseTab,
    onClickFavorite: props.onAddTabAsFavorite,
    onClickAttach: props.onAttachTab,
    onClickDetach: props.onDetachTab,
  };
};

// EXPORT

export default injectSheet({ ...subdockListStyle, ...ownStyle })(Tabs) as React.ComponentType<OwnProps>;
