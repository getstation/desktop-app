import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

import SubdockItem, { MinimalSubdockApplication } from '../SubdockItem';
import { ActiveTab } from '../../Container';

import { HomeTab, SubdockActionsProps } from './types';
import { SubdockListStyle, subdockListStyle } from './styles';
import { extractTabActions } from './Tabs';
import { useActionsWrapper } from './TabItem';

export type OwnProps = SubdockActionsProps & {
  className?: string,
  application: MinimalSubdockApplication,
  item: HomeTab,
  activeTab: ActiveTab,
};

const Home = ({
  classes,
  className,
  application,
  item,
  activeTab,
  ...props
}: OwnProps & { classes: SubdockListStyle }) => {
  const tabActions = extractTabActions(props);

  const surchargedItem = useSanitization(item, activeTab);
  const wrappedActions = useActionsWrapper(tabActions, item);

  return (
    <div>
      <ul>
        <SubdockItem
          application={application}
          item={surchargedItem}
          actions={wrappedActions}
        />
      </ul>
    </div>
  );
};

// HOOKS

/**
 * Transform received Tab (+ various options) into an item shapped for SubdockItem.
 */
const useSanitization = (item: HomeTab, activeTab: ActiveTab) => {
  return React.useMemo(
    () => ({
      title: 'Home',
      isActive: item.tabId === activeTab.id,
      isTabApplicationHome: true,
      isDetached: Boolean(item.isDetached),
      favorite: false,
      noClose: true,
      canDetach: true,
    }),
    [item, activeTab],
  );
};

export default injectSheet(subdockListStyle)(Home) as React.ComponentType<OwnProps>;
