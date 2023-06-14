import * as Immutable from 'immutable';
import * as React from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// @ts-ignore: no declaration file
import { updateUI } from 'redux-ui/transpiled/action-reducer';
// @ts-ignore: no declaration file
import * as SimpleIcons from 'simple-icons';
import { withGetActivity } from '../activity/queries@local.gql.generated';
import { getFocus } from '../app/selectors';
import { SHORTCUTS } from '../keyboard-shortcuts';
import { hasGDriveTokens } from '../plugins/selectors';
import { Omit, StationState } from '../types';
import { getUIQSHighlightedItemId } from '../ui/selectors';
import BangInput from './components/BangInput';
import BangPresenter from './components/BangPresenter';
import {
  cyclingStep,
  SearchPaneItemSelectedVia,
  SearchPaneItemsListCycleDirection,
  SearchPaneItemsListCycleVia,
  SearchResultSerialized,
  SearchSectionSerialized,
  selectItem,
  setSearchValue,
  setVisibility,
} from './duck';
import { findItemById, getId } from './helpers/utils';
import { canShowInsert, getResultsJS, getSearchSessionId, getSearchValue, isVisible } from './selectors';

const kbShortcut = SHORTCUTS.bang.kbd.replace(' ', '+');

export interface OwnProps {
  onQuit: () => void,
}

export interface StateProps {
  highlightedItemId?: string;
  searchSessionId: string;
  searchValue: string;
  items: SearchSectionSerialized[];
  historyItems: SearchResultSerialized[];
  isVisible: boolean;
  shouldShowInsert: boolean;
  focus: number | undefined;
  isGDriveConnected: boolean;
}

export interface DispatchProps {
  onSearchValueChange: typeof setSearchValue;
  onSelectItem: typeof selectItem;
  onShowSettings: () => void;
  setHighlightedItemId: (id?: string) => void;
  cyclingStep: typeof cyclingStep;
}

export type Props = OwnProps & StateProps & DispatchProps;

function* getFlatItemsIterator(items: SearchSectionSerialized[]) {
  for (const item of items) {
    if (!item.results) continue;
    yield* item.results;
  }
}

class BangSubdockImpl extends React.PureComponent<Props> {
  static defaultProps = {
    setHighlightedItemId: () => {},
    onQuit: () => {},
  };

  private input: BangInput | null;
  private flatItems: SearchResultSerialized[];

  constructor(props: Props) {
    super(props);

    this.flatItems = [];

    this.setRef = this.setRef.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.resetHighlightedItem = this.resetHighlightedItem.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  setRef(ref: BangInput | null) {
    this.input = ref;
  }

  getFlatItems(props: Props = this.props): SearchResultSerialized[] {
    if (props.searchValue === '') return props.historyItems;
    return Array.from(getFlatItemsIterator(props.items));
  }

  setFlatItems(items: SearchResultSerialized[]): void {
    this.flatItems = items;
    if (items.length >= 1) {
      this.props.setHighlightedItemId(getId(items[0]));
    } else {
      this.props.setHighlightedItemId(undefined);
    }
  }

  // tslint:disable-next-line:function-name
  UNSAFE_componentWillMount() {
    this.setFlatItems(this.getFlatItems());
  }

  componentWillUnmount() {
    this.props.setHighlightedItemId(undefined);
  }

  // tslint:disable-next-line:function-name
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const items = this.flatItems;
    const nextItems = this.getFlatItems(nextProps);

    // compare the list of ids
    // if they changed we highlight the first item
    const itemIds = Immutable.Set(items.map(getId));
    const nextItemIds = Immutable.Set(nextItems.map(getId));
    if (!nextItemIds.equals(itemIds)) {
      this.setFlatItems(nextItems);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const prevVisibleAndFocus = prevProps.isVisible && prevProps.focus;
    const visibleAndFocus = this.props.isVisible && this.props.focus;
    // on get visible, focus
    if (!prevVisibleAndFocus && !visibleAndFocus) {
      if (this.input) {
        this.input.focus();
        this.input.selectAll();
      }
    }
    // on get hidden, blur
    if (prevVisibleAndFocus && !visibleAndFocus) {
      if (this.input) this.input.blur();
    }
  }

  componentDidMount() {
    if (this.input) {
      this.input.focus();
      this.input.selectAll();
    }
  }

  getHighlightedItemIndex() {
    const items = this.flatItems;
    const { highlightedItemId } = this.props;

    if (highlightedItemId === null) return null;

    const index = items.findIndex(item => getId(item) === highlightedItemId);

    // not found
    if (index === -1) return null;

    return index;
  }

  getNextHighlightedItemIndex(direction: SearchPaneItemsListCycleDirection, cycling: boolean = false): number | null {
    const items = this.flatItems;

    const start = 0;
    const end = items.length - 1;
    if (end < 0) return null; // no items

    const currentIndex = this.getHighlightedItemIndex() || 0;
    const nextIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1;

    if (!cycling) {
      if (nextIndex < start) return null; // no next index
      if (nextIndex > end) return null; // no next index
    }
    if (nextIndex < start) return end; // cycle to end
    if (nextIndex > end) return start; // cycle to start

    return nextIndex; // otherwise, move index
  }

  resetHighlightedItem() {
    const items = this.flatItems;
    this.props.setHighlightedItemId(getId(items[0]));
  }

  selectNextItem = (via: SearchPaneItemsListCycleVia, direction: SearchPaneItemsListCycleDirection) => {
    const items = this.flatItems;
    const { searchValue } = this.props;

    const cycling = via !== 'keyboard-arrow';
    const nextIndex = this.getNextHighlightedItemIndex(direction, cycling);

    // do nothing if no nextIndex
    if (nextIndex === null || !items[nextIndex]) return;

    this.props.cyclingStep(items[nextIndex], nextIndex, direction, 'center-modal', via, searchValue);
  }

  selectNextItemArrowDown = () => this.selectNextItem('keyboard-arrow', 'down');
  selectNextItemArrowUp = () => this.selectNextItem('keyboard-arrow', 'up');
  selectNextItemTabDown = () => this.selectNextItem('keyboard-tab', 'down');
  selectNextItemTabUp = () => this.selectNextItem('keyboard-tab', 'up');

  handleClick(itemId: string, position: number) {
    const item = findItemById(itemId, this.flatItems);
    if (!item) return;

    this.selectItem(itemId, position, 'click');
  }

  focusInput = () => {
    if (this.input) {
      this.input.focus();
    }
  }

  handleEnter = async () => {
    const { highlightedItemId } = this.props;
    if (!highlightedItemId) return;

    // if the item is not displayed, do nothing
    const item = findItemById(highlightedItemId, this.flatItems);
    if (!item) return;

    const position = this.flatItems.indexOf(item);
    this.selectItem(highlightedItemId, position, 'keyboard-enter');
  }

  selectItem(itemId: string, position: number, via: SearchPaneItemSelectedVia) {
    const item = findItemById(itemId, this.flatItems);
    if (!item) return;

    const { searchValue } = this.props;
    this.props.onSelectItem(item, position, via, 'center-modal', searchValue);
  }

  render() {
    return (
      <BangPresenter
        {...this.props}
        kbShortcut={kbShortcut}
        setRef={this.setRef}
        handleArrowDown={this.selectNextItemArrowDown}
        handleArrowUp={this.selectNextItemArrowUp}
        handleTab={this.selectNextItemTabDown}
        handleShiftTab={this.selectNextItemTabUp}
        handleEnter={this.handleEnter}
        handleClick={this.handleClick}
        resetHighlightedItem={this.resetHighlightedItem}
        onCollapseSection={this.focusInput}
      />
    );
  }
}

const BangSubdock = compose(
  withGetActivity({
    props: ({ data }) => ({
      historyItems: data && data.activity ? data.activity : [],
    }),
  }),
  connect<Omit<StateProps, 'historyItems'>, DispatchProps>(
    (state: StationState) => ({
      searchSessionId: getSearchSessionId(state),
      searchValue: getSearchValue(state),
      highlightedItemId: getUIQSHighlightedItemId(state),
      items: getResultsJS(state),
      isVisible: isVisible(state),
      shouldShowInsert: canShowInsert(state),
      focus: getFocus(state),
      isGDriveConnected: hasGDriveTokens(state),
    }),
    dispatch => ({
      ...bindActionCreators(
        {
          cyclingStep,
          onSearchValueChange: setSearchValue,
          onSelectItem: selectItem,
          setHighlightedItemId: (id?: string) => updateUI('qs', 'highlightedItemId', id),
        },
        dispatch,
      ),
      onShowSettings: () => {
        dispatch(updateUI('settings', 'activeTabTitle', 'Quick-Switch'));
        dispatch(updateUI('settings', 'isVisible', true));
        dispatch(setVisibility('center-modal', false, 'topbar_menu_or_keyboard_shortcut'));
      },
    })),
)(BangSubdockImpl);

export default BangSubdock as React.ComponentType<OwnProps>;
