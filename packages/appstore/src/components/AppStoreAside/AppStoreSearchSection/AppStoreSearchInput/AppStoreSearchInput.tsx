import * as React from 'react';
import { graphql } from 'react-apollo';
import { isEqual, flowRight as compose } from 'lodash';
import * as Mousetrap from 'mousetrap';
import injectSheet from 'react-jss';
import * as classNames from 'classnames';
import { colors } from '@src/theme';
import { Icon, IconSymbol } from '@getstation/theme';
import { Application } from '@src/graphql/queries';
import withSearchString, { WithSearchStringProps } from '@src/HOC/withSearchString';
import { SET_SEARCH_STRING } from '@src/graphql/schemes/search';
import { SET_CUSTOM_APP_REQUEST_MODE } from '@src/graphql/schemes/customAppRequestMode';
import { MutateSetSearchStringProps } from '@src/graphql/types/mutateSetSearchString';
import { MutateSetCustomAppRequestModeProps } from '@src/graphql/types/mutateSetCustomAppRequestMode';

import styles, { IClasses } from './styles';

export interface AppStoreSearchInputProps {
  appStoreContext: number,
  classes?: IClasses,
}

export interface AppStoreSearchInputState {
  searchString: string,
  isFocused: boolean,
}

type Props = AppStoreSearchInputProps
  & WithSearchStringProps
  & MutateSetSearchStringProps
  & MutateSetCustomAppRequestModeProps;

@injectSheet(styles)
class AppStoreSearchInput extends React.PureComponent<Props, AppStoreSearchInputState> {

  protected inputRef: React.RefObject<React.InputHTMLAttributes<Application>> = React.createRef();

  constructor(props: Props) {
    super(props);
    this.state = {
      searchString: '',
      isFocused: false,
    };
  }

  componentDidMount() {
    this.focusOnSearchInput();

    Mousetrap.bind('mod+f', (e: any) => {
      e.preventDefault();
      this.focusOnSearchInput();
    }, 'keydown');
  }

  componentDidUpdate(prevProps: AppStoreSearchInputProps) {
    if (isEqual(prevProps, this.props)) {
      return;
    }

    if (this.props.searchString !== this.state.searchString) {
      this.setState({ searchString: this.props.searchString || '' });
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind('mod+f');
  }

  focusOnSearchInput = () => {
    this.inputRef
    && this.inputRef.current
    && this.inputRef.current
    && this.inputRef.current.focus();
  }

  setSearchString(searchString: string, searchStringAfterEnterPress?: string, isEnterPressed?: boolean) {
    this.props.mutateSetSearchString({
      variables: {
        searchString,
        searchStringAfterEnterPress: searchStringAfterEnterPress || '',
        isEnterPressed: isEnterPressed || false,
      },
    });
  }

  onInputEnterPress = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      this.setSearchString(this.props.searchString || '', this.props.searchString || '', !!this.props.searchString);
      this.props.mutateSetCustomAppRequestMode({
        variables: {
          appRequestIsOpen: false,
          currentMode: '',
        },
      });
    }
  }

  onInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    this.setSearchString(
      target.value.trim(),
      !!target.value && this.props.searchStringAfterEnterPress || '',
      !!target.value && this.props.isEnterPressed,
    );
    this.setState({ searchString: target.value });
  }

  render() {
    const { classes } = this.props;

    const inputProps = {
      placeholder: 'Search an app',
      value: this.state.searchString || '',
      type: 'search',
      onKeyDown: this.onInputEnterPress,
      onChange: this.onInputChange,
      role: 'textbox',
      'aria-label': 'Search an application',
      onFocus: () => this.setState({ isFocused: true }),
      onBlur: () => this.setState({ isFocused: false }),
    };
    return (
      <div className={classes!.container}>
        <label
          className={classNames(
            classes!.label,
            { 'active-focus': this.state.isFocused }
          )}
        >
          <Icon
            className={classes!.searchIcon}
            symbolId={IconSymbol.SEARCH}
            size={25}
            color={colors.blueGray100}
          />
          <input
            {...inputProps}
            className={classes!.autosuggestInput}
            ref={this.inputRef}
          />
        </label>
      </div>
    );
  }
}

export default compose(
  withSearchString,
  graphql(SET_SEARCH_STRING, { name: 'mutateSetSearchString' }),
  graphql(SET_CUSTOM_APP_REQUEST_MODE, { name: 'mutateSetCustomAppRequestMode' }),
)(AppStoreSearchInput);
