import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { getThemeColors } from '../theme/selectors';
import TabSearchInput from './components/TabSearchInput';
import { findNext, setActiveFocusForTab, setActiveForTab, setSearchStringForTab } from './duck';
import {
  getSearchActiveFocusForTab,
  getSearchResultsInfoForTab,
  getSearchStringForTab,
  isSearchActiveForTab
} from './selectors';

@connect(
  (state, ownProps) => {
    const { tabId } = ownProps;
    return {
      themeColors: getThemeColors(state),
      active: isSearchActiveForTab(state, tabId),
      searchString: getSearchStringForTab(state, tabId),
      resultsInfo: getSearchResultsInfoForTab(state, tabId),
      activeFocus: getSearchActiveFocusForTab(state, tabId),
    };
  },
  (dispatch, ownProps) => {
    const { tabId } = ownProps;
    return {
      onSearchStringChange: searchString => dispatch(setSearchStringForTab(tabId, searchString)),
      onFindNext: () => dispatch(findNext(tabId)),
      onClose: () => dispatch(setActiveForTab(tabId, false)),
      resetActiveFocus: () => dispatch(setActiveFocusForTab(tabId, false))
    };
  }
)
export default class TabSearchInputContainer extends PureComponent {

  static propTypes = {
    themeColors: PropTypes.arrayOf(PropTypes.string),
    active: PropTypes.bool,
    searchString: PropTypes.string,
    resultsInfo: PropTypes.shape({
      activeMatchOrdinal: PropTypes.number,
      matchesCount: PropTypes.number
    }),
    activeFocus: PropTypes.bool,
    resetActiveFocus: PropTypes.func,
    onSearchStringChange: PropTypes.func,
    onFindNext: PropTypes.func,
    onClose: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }


  componentDidUpdate() {
    if (this.props.activeFocus && this.inputRef.current) {
      this.inputRef.current.focus();
      this.inputRef.current.select();
      this.props.resetActiveFocus();
    }
  }

  render() {
    const { active } = this.props;

    return (
      <CSSTransition
        in={active}
        unmountOnExit
        classNames="slide-down"
        timeout={200}
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}
      >
        <TabSearchInput
          themeColors={this.props.themeColors}
          searchString={this.props.searchString}
          onFindNext={this.props.onFindNext}
          resultsInfo={this.props.resultsInfo}
          onSearchStringChange={this.props.onSearchStringChange}
          onClose={this.props.onClose}
          inputRef={this.inputRef}
        />
      </CSSTransition>
    );
  }
}
