import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { Icon, IconSymbol } from '@getstation/theme';
import { colors } from '@src/theme';
import * as classNames from 'classnames';

const { useState, forwardRef } = React;

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    width: '100%',
    height: '30px',
    backgroundColor: colors.white,
    borderRadius: '15px',
    border: '1px solid rgba(157, 167, 174, .6)',
    display: 'flex',
    alignItems: 'center',
    color: colors.blueGray100,
    overflow: 'hidden',
    '&.isFocused': {
      boxShadow: `0 0 4px 0 ${colors.blueGlowing}`,
      border: `1px solid ${colors.blueGlowing}`,
    },
  },
  searchIcon: {
    marginLeft: 10,
    opacity: '.5',
  },
  input: {
    width: '100%',
    placeholder: colors.blueGray100,
    fontSize: 13,
    border: 'none',
    flexGrow: 1,
    height: '100%',
    padding: [0, 8],
    outline: 'none',
    borderRadius: '0 20px 20px 0',
    transform: 'translate3d(0,-1px,0)',
    '-webkit-appearance': 'none',
  },
});

type Props = {
  onQueryChange: (query: string) => any,
  query: string,
};

const Search = forwardRef(
({
  onQueryChange,
  query,
}: Props,
 ref: React.Ref<HTMLInputElement>,
) => {
  const classes = useStyles();

  const [isFocused, setFocus] = useState(false);

  const onFocus = () => setFocus(true);
  const onBlur = () => setFocus(false);

  const onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(value);
  };

  return (
    <div
      className={
        classNames(
          classes!.container,
          { isFocused }
        )
      }
    >
      <Icon
        className={classes!.searchIcon}
        symbolId={IconSymbol.SEARCH}
        size={25}
        color={colors.blueGray100}
      />
      <input
        ref={ref}
        className={classes!.input}
        onFocus={onFocus}
        onBlur={onBlur}
        type="search"
        placeholder="Search an app"
        value={query}
        onChange={onChange}
      />
    </div>
  );
});

export default Search;
