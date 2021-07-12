import * as React from 'react';
// @ts-ignore: no declaration file
import { useThrottleCallback } from '@react-hook/throttle';
import { tap, compose } from 'ramda';
import Maybe from 'graphql/tsutils/Maybe';

import { SUBDOCK_ITEM_HEIGHT } from '../SubdockItem';

import { Tab, Favorite } from './types';

const { useCallback, useEffect, useState } = React;

export enum IdentifierType {
  Tab = 'tabId',
  Favorite = 'url',
}

export const useScrollToActiveTabOnMount = (
  tabs: Tab[] | Favorite[],
  activeIdentifier: Maybe<string>,
  identifierType: IdentifierType
): React.RefObject<HTMLDivElement> => {
  const ref = React.useRef<HTMLDivElement>(null);

  // on mount
  useEffect(() => {
    // Compute position needed to see the selected element
    const pos = tabs.findIndex((elem: Tab | Favorite) => activeIdentifier === elem[identifierType]);
    const scrollPos = (pos < 3) ? 0 : (pos - 2) * SUBDOCK_ITEM_HEIGHT;
    if (scrollPos >= 0 && ref.current) {
      // Apply computed position to scroll view
      ref.current.scrollTop = scrollPos;
    }
  }, [tabs, activeIdentifier, identifierType]);

  return ref;
};

type WithOnScroll<T = HTMLDivElement> = {
  onScroll: (e: React.SyntheticEvent<T>) => void,
};

export type VisibleItems = {
  firstIndex: number,
  lastIndex: number,
};

export type ScrollState = {
  top: boolean,
  bottom: boolean,
};

export type ScrollData = WithOnScroll & {
  scrolled: ScrollState,
  visibleItems: VisibleItems,
};

const NB_VISIBLE_ITEMS_BEFORE = 1;
const NB_VISIBLE_ITEMS_AFTER = 1;

const getNbVisibleItems = (offsetHeight: number) => NB_VISIBLE_ITEMS_AFTER + Math.trunc(offsetHeight / SUBDOCK_ITEM_HEIGHT);
const getFirstIndex = (scrollTop: number) => Math.max(0, Math.trunc(scrollTop / SUBDOCK_ITEM_HEIGHT) - NB_VISIBLE_ITEMS_BEFORE);
const getLastIndex = (firstIndex: number, offsetHeight: number) => firstIndex + getNbVisibleItems(offsetHeight);

const useScrolledState = (): ScrollState & WithOnScroll => {
  const [scrolledState, setScrolledState] = useState<ScrollState>({ top: true, bottom: false });

  const onScroll = useCallback((event: React.SyntheticEvent<HTMLDivElement>) => {
    const elem = event.currentTarget;
    const position = elem.scrollTop + elem.offsetHeight;

    // If top but and state not yet update
    if (elem.scrollTop === 0 && !scrolledState.top) {
      setScrolledState({ top: true, bottom: false });
      // If bottom and state not yet update
    } else if (position === elem.scrollHeight && !scrolledState.bottom) {
      setScrolledState({ top: false, bottom: true });
      // Else, we're in the middle, check state to update only if necessary
    } else {
      if (scrolledState.top) setScrolledState({ top: false, bottom: scrolledState.bottom });
      if (scrolledState.bottom) setScrolledState({  top: scrolledState.top, bottom: false });
    }
  }, [scrolledState.top, scrolledState.bottom]);

  return { ...scrolledState, onScroll };
};

const useVisibleItems = (): VisibleItems & WithOnScroll => {
  const [visibleItems, setVisibleItems] = useState<VisibleItems>({
    firstIndex: 0,
    lastIndex: 5,
  });

  const onScroll = useCallback((event: React.SyntheticEvent<HTMLDivElement>) => {
    const elem = event.currentTarget;

    const firstIndex = getFirstIndex(elem.scrollTop);
    const lastIndex = getLastIndex(firstIndex, elem.offsetHeight);

    if (visibleItems.firstIndex !== firstIndex || visibleItems.lastIndex !== lastIndex) {
      setVisibleItems({ firstIndex, lastIndex });
    }
  }, [visibleItems.firstIndex, visibleItems.lastIndex]);

  return { ...visibleItems, onScroll };
};

export const useScrollData = (): ScrollData => {
  const visibleItems = useVisibleItems();
  const scrolledState = useScrolledState();

  const onScroll = useCallback(compose(
    tap(visibleItems.onScroll),
    tap(scrolledState.onScroll)
  ), [visibleItems.onScroll, scrolledState.onScroll]);

  return {
    scrolled: scrolledState,
    visibleItems,
    onScroll,
  };
};
