import { Icon, IconSymbol } from '../Icon';
import * as Mousetrap from 'mousetrap';
import * as React from 'react';
import { DebounceInput } from 'react-debounce-input';
import injectSheet, { WithSheet } from 'react-jss';
import { createStyles, ThemeTypes } from '../../types';

export interface OwnProps {
  placeholder: string,
  value: string,
  onChange: (value: string) => any,
  autofocus?: boolean,
}

const styles = (theme: ThemeTypes) => createStyles({
  container: {
    padding: [0, 10] as any,
    height: 40,
    borderRadius: 20,
    width: '100%',
    maxWidth: 600,
    display: 'flex',
    alignItems: 'center',
    color: '#999',
    overflow: 'hidden',
    backgroundColor: theme.colors.gray.light,
  },
  icon: {
    fill: '#949494',
    width: 25,
    height: 25,
  },
  input: {
    border: 'none',
    flexGrow: 1,
    height: '100%',
    fontSize: '14px',
    backgroundColor: 'transparent',
  },
});

type Props = OwnProps & WithSheet<typeof styles>;

class SearchInputImpl extends React.PureComponent<Props, {}> {
  inputRef: any;

  constructor(props: Props) {
    super(props);

    this.inputRef = React.createRef();
  }

  componentWillMount() {
    Mousetrap.bind('mod+f', (e: any) => {
      if (this.inputRef) {
        e.preventDefault();
        this.inputRef.current.focus();
      }
    }, 'keydown');
  }

  componentWillUnmount() {
    Mousetrap.unbind('mod+f');
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(e.target.value);
  }

  render() {
    const { classes, placeholder, value, autofocus } = this.props;

    return (
      <div className={classes.container}>
        <Icon symbolId={IconSymbol.SEARCH} size={40} className={classes.icon} />

        <DebounceInput
          minLength={0}
          debounceTimeout={150}
          className={classes.input}
          autoFocus={autofocus}
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={this.handleInputChange}
          ref={this.inputRef}
        />
      </div>
    );
  }
}

export const SearchInput = injectSheet(styles)(SearchInputImpl);
