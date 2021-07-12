import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import ReactDOM = require('react-dom');

import { ActiveTab } from '../../Container';

import { Application, SubdockActionsProps, Tab, Favorite } from './types';
import AddApplicationButton from './AddApplicationButton';
import Home from './Home';
import Favorites from './Favorites';
import Tabs from './Tabs';

export interface State {
  openedPagesIsTop: Boolean,
  openedPagesIsBottom: Boolean,
}

type InjectSheetProps = {
  classes: {
    content: string,
    title: string,
    sectionHeader: string,
    newPageButton: string,
  },
};

type OwnProps = SubdockActionsProps & {
  application: Application,
  activeTab: ActiveTab,
  onOpenNewTab: () => void,
  onClickAddNewInstance: (application: Application, identityNeeded?: boolean) => void,
  handleHideSubdock: () => any,
};

export type Props = OwnProps & InjectSheetProps;

class SubdockPanel extends React.PureComponent<Props, State> {
  tabsRef: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: Props) {
    super(props);

    this.handleAddNewInstance = this.handleAddNewInstance.bind(this);
    this.handleOpenNewTab = this.handleOpenNewTab.bind(this);
  }

  handleAddNewInstance() {
    const { application, onClickAddNewInstance } = this.props;

    if (!application) return;
    onClickAddNewInstance(application, Boolean(application.identity));
  }

  handleOpenNewTab() {
    const { application, onOpenNewTab } = this.props;

    if (!application) return;
    onOpenNewTab();

    if (this.tabsRef.current) {
      const element = ReactDOM.findDOMNode(this.tabsRef.current) as Element;
      if (element && element.scrollTop) {
        element.scrollTop = 0;
      }
    }
  }

  renderAddApplicationButton(nbDisplayedTabs: number) {
    const { application } = this.props;
    if (nbDisplayedTabs > 0) return null;
    return (
      <AddApplicationButton
        application={application}
        loading={false}
        onOpenNewTab={this.handleOpenNewTab}
        onClickAddNewInstance={this.handleAddNewInstance}
      />
    );
  }

  render() {
    const { application, activeTab } = this.props;
    const { tabApplicationHome } = application;

    // Transfer down only needed Application informations
    const bareApp = {
      id: application.id,
      iconUrl: application.manifestData.interpretedIconURL,
      themeColor: application.manifestData.theme_color,
    };

    // Prep-up the lists to display
    const {
      orderedTabsForSubdock: tabs,
      orderedFavoritesForSubdock: favorites,
    } = application;

    const { reducedTabs, reducedFavorites } = reduceTabsAndFavorites(tabs, favorites);

    // TODO: use jss
    return (
      <div className="l-subdock__panel l-subdock__panel--active">
        { tabApplicationHome &&
          <Home
            {...this.props}
            application={bareApp}
            item={tabApplicationHome}
            activeTab={activeTab}
          />
        }

        <Favorites
          {...this.props}
          application={bareApp}
          items={reducedFavorites}
          activeTab={activeTab}
        />

        <Tabs
          {...this.props}
          ref={this.tabsRef}
          application={bareApp}
          tabs={reducedTabs}
          activeTab={activeTab}
          handleOpenNewTab={this.handleOpenNewTab}
        />
        {this.renderAddApplicationButton(reducedTabs.length)}
      </div>
    );
  }
}

// UTILS

/**
 * Filter out tabs if they exists in favorites (to hide them) and
 * enhance favorites with info about their related tabs when they exists.
 * @param tabs Tabs received from the API
 * @param favorites Favorites received from the API
 */
const reduceTabsAndFavorites = (tabs: Tab[], favorites: Favorite[]) => {
  const mapped = new Map();

  const reducedTabs = tabs.reduce((acc, tab): Tab[] => {
    const favorite = favorites.find(fav => fav.url === tab.url);
    if (!favorite) {
      acc.push(tab);
    } else {
      mapped.set(favorite.favoriteId, {
        ...favorite,
        relatedTab: {
          id: tab.tabId,
          bxResource: tab.associatedBxResource,
          isDetached: tab.isDetached,
          specificIconId: tab.specificIconId,
        },
      });
    }
    return acc;
  }, []);

  const reducedFavorites = favorites.map(fav => {
    const modifed = mapped.get(fav.favoriteId);
    return (modifed) ? modifed : fav;
  });

  return {
    reducedTabs,
    reducedFavorites,
  };
};

export default SubdockPanel as React.ComponentType<OwnProps>;
