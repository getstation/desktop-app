import { GradientType, withGradient } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import {
  SearchResultSerialized,
  SearchSectionSerialized,
  selectItem,
  setSearchValue,
} from '../duck';
import BangBottom from './BangBottom';
import BangInput from './BangInput';
import BangInsert from './BangInsert';
import BangList from './BangList';

interface Classes {
  content: string;
}

export interface OwnProps {
  classes?: Classes;
  searchValue: string;
  items: SearchSectionSerialized[];
  historyItems: SearchResultSerialized[];
  isVisible: boolean;
  shouldShowInsert: boolean;
  focus: number | undefined;
  isGDriveConnected: boolean;
  onSearchValueChange: typeof setSearchValue;
  onSelectItem: typeof selectItem;
  onShowSettings: () => void;
  onQuit: () => void;
  setHighlightedItemId: (id: string) => void;
  highlightedItemId?: string;
  gDriveIcon: string;
  kbShortcut: string;
  setRef: (ref: BangInput | null) => void;
  handleArrowDown: () => void;
  handleArrowUp: () => void;
  handleTab: () => void;
  handleShiftTab: () => void;
  handleEnter: (modifier: { altKey: boolean }) => void;
  handleClick: (itemId: string, position: number) => void;
  resetHighlightedItem: () => void;
  onCollapseSection: () => void;
}

interface StateFromProps {
  themeGradient: string;
}

type Props = OwnProps & StateFromProps;

@injectSheet({
  content: {
    width: 500,
    height: 640,
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    marginTop: 50,
    backgroundImage: (props: Props) => props.themeGradient,
    borderRadius: 5,
    boxShadow: '0px 10px 60px 5px rgba(0, 0, 0, 0.6)',
    overflow: 'hidden',
  },
})
class BangPresenterImpl extends React.PureComponent<Props, {}> {
  render() {
    const {
      classes,
      searchValue,
      shouldShowInsert,
      onSearchValueChange,
      onQuit,
      isGDriveConnected,
      onShowSettings,
      historyItems,
      items,
      highlightedItemId,
      kbShortcut,
      gDriveIcon,
      setRef,
      handleEnter,
      handleClick,
      resetHighlightedItem,
      onCollapseSection,
    } = this.props;

    const hasEmptyQuery = searchValue === '';

    return (
      <div className={classes!.content}>
        <BangInput
          refBangInput={setRef}
          onValueChange={onSearchValueChange}
          value={searchValue}
          onArrowDown={this.props.handleArrowDown}
          onArrowUp={this.props.handleArrowUp}
          onTab={this.props.handleTab}
          onShiftTab={this.props.handleShiftTab}
          onEnter={handleEnter}
          onEscape={onQuit}
          shortcut={shouldShowInsert ? kbShortcut : undefined}
        />

        <BangList
          forEmptyQuery={hasEmptyQuery}
          items={items}
          historyItems={historyItems}
          highlightedItemId={highlightedItemId}
          onItemClick={handleClick}
          onResetHighlightedItem={resetHighlightedItem}
          onCollapseSection={onCollapseSection}
        />

        {shouldShowInsert && searchValue === '' && (
          <BangInsert
            gDriveIconSrc={gDriveIcon}
            onGDriveConnect={onShowSettings}
            isGDriveConnected={isGDriveConnected}
          />
        )}

        <BangBottom onClickSettings={this.props.onShowSettings} />
      </div>
    );
  }
}

export default withGradient(GradientType.withDarkOverlay)(BangPresenterImpl);
