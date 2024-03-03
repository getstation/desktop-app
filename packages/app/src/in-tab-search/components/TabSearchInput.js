import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import { Icon, IconSymbol } from '@getstation/theme';

@injectSheet(theme => ({
  container: {
    borderRadius: `0 0 0 ${theme.$borderRadius}`,
    display: 'flex',
    height: '34px !important',
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: theme.$zIndexUltime,
    backgroundColor: props => theme.mixinDarkenColor(props.themeColors[0])
  },
  searchIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    ...theme.avatarMixin('24px'),
    margin: '5px',
  },
  input: {
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: `0 0 0 ${theme.$borderRadius}`,
    height: '20px',
    marginTop: '7px',
    padding: '0 45px 0 4px',
    width: '220px',
    color: 'rgba(255, 255, 255, 0.6)',
    caretColor: 'rgba(255, 255, 255, 0.6)',
    ...theme.fontMixin(14),
    '&::selection': {
      background: 'white'
    }
  },
  number: {
    position: 'absolute',
    right: '34px',
    marginTop: '9px',
    height: '20px',
    lineHeight: '20px',
    color: 'rgba(255, 255, 255, 0.2)',
    ...theme.fontMixin(12)
  },
  closeIcon: {
    margin: '5px'
  }
}))
export default class TabSearchInput extends PureComponent {
  static propTypes = {
    searchString: PropTypes.string,
    resultsInfo: PropTypes.shape({
      activeMatchOrdinal: PropTypes.number,
      matchesCount: PropTypes.number
    }),
    onSearchStringChange: PropTypes.func,
    onFindNext: PropTypes.func,
    onClose: PropTypes.func,
    inputRef: PropTypes.object,
    classes: PropTypes.object,
  };

  handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
        this.props.onFindNext();
        break;
      case 'Escape':
        this.props.onClose();
        break;
      default:
    }
  }

  handleSearchStringChange = (e) => {
    this.props.onSearchStringChange(e.target.value);
  }

  render() {
    const { resultsInfo, classes } = this.props;
    return (
      <div className={classes.container}>
        <Icon
          color="rgba(255, 255, 255, 0.6)"
          size={24}
          symbolId={IconSymbol.SEARCH}
          className={classes.searchIcon}
        />
        <input
          className={classes.input}
          type="text"
          onKeyDown={this.handleKeyDown}
          value={this.props.searchString}
          onChange={this.handleSearchStringChange}
          ref={this.props.inputRef}
        />
        { resultsInfo &&
          <span className={classes.number}>{resultsInfo.activeMatchOrdinal} of {resultsInfo.matchesCount}</span>
        }
        <Icon
          symbolId={IconSymbol.CROSS}
          size={24}
          color="rgba(255, 255, 255, 0.6)"
          className={classes.closeIcon}
          onClick={this.props.onClose}
        />
      </div>
    );
  }
}
