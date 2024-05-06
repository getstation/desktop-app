import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import TrafficLightsContainer from './TrafficLightsContainer';
import DockNavigation from '../../dock-navigation/DockNavigationContainer';
import SearchWrapper from '../../bang/BangContainer';
import RecentDockContainer from './RecentDockContainer';
import {
  cyclingStep as bangCyclingStep,
  SearchPaneFormat, SearchPaneItemSelectedVia,
  SearchResultSerialized,
  selectItem as selectBangItem,
  SearchPaneClosedVia,
} from '../../bang/duck';
import { ActivityEntry } from '../../activity/queries@local.gql.generated';

interface Classes {
  container: string,
}

interface Props {
  classes?: Classes,
  isDarwin: boolean,
  onClose: () => any,
  handleBangWillUnmount: () => any,
  handleBangDidMount: () => any,
  handleRecentDockDidMount: () => any,
  handleRecentDockWillUnmount: () => any,
  ctrlTabCycling: boolean,
  handlePaneEscape: (format: SearchPaneFormat) => any,
  cyclingStep: typeof bangCyclingStep,
  stopCycling: () => any,
  recentApplications: ActivityEntry[],
  selectItem: typeof selectBangItem,
  setHighlightedRecentSubdockItemId: (id?: string) => void,
  highlightedRecentSubdockItemId?: string,
  isRecentSubdockVisible: boolean,
  showRecentSubdock: () => void,
  hideRecentSubdock: (via: SearchPaneClosedVia) => void,
}

const styles = () => ({
  container: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingBottom: 2,
  },
});

@injectSheet(styles)
export default class DockTopSection extends React.PureComponent<Props, {}> {
  render() {
    const {
      classes, isDarwin, onClose, cyclingStep,
      ctrlTabCycling, handlePaneEscape, stopCycling, recentApplications, selectItem,
      handleRecentDockDidMount, handleRecentDockWillUnmount, highlightedRecentSubdockItemId,
      setHighlightedRecentSubdockItemId, isRecentSubdockVisible, showRecentSubdock, hideRecentSubdock,
    } = this.props;

    return (
      <div className={classes!.container}>
        {isDarwin &&
          <TrafficLightsContainer onClose={onClose} />
        }

        <DockNavigation />

        <SearchWrapper
          onQuit={() => handlePaneEscape('center-modal')}
        />

        <RecentDockContainer
          cyclingStep={cyclingStep}
          isSubdockVisible={isRecentSubdockVisible}
          showRecentSubdock={showRecentSubdock}
          hideRecentSubdock={hideRecentSubdock}
          highlightedItemId={highlightedRecentSubdockItemId}
          setHighlightedItemId={setHighlightedRecentSubdockItemId}
          recentApplications={recentApplications}
          selectItem={
            (item: SearchResultSerialized, via: SearchPaneItemSelectedVia, position: number) =>
              selectItem(item, position, via, 'subdock')
          }
          ctrlTabCycling={ctrlTabCycling}
          stopCycling={stopCycling}
          onDidMount={handleRecentDockDidMount}
          onWillUnmount={handleRecentDockWillUnmount}
        />
      </div>
    );
  }
}
