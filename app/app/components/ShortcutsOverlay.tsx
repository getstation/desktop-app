import { either, propEq, reject } from 'ramda';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import Overlay from '../../components/Overlay';
import { CATEGORIES, getShortcutsByCategory, KeyboardShortcut } from '../../keyboard-shortcuts';
import { Filter } from '../../utils/fp';

interface Classes {
  kbd: string,
  label: string,
  category: string,
  item: string,
  subtitle: string,
  content: string,
}

export interface Props {
  classes?: Classes,
  setVisibility: (isVisible: boolean) => {},
}

const rejectDisabledAndInvisible: Filter<KeyboardShortcut> = reject(
  either(
    propEq('disabled', true),
    propEq('doNotShowInShortcutsOverlay', true),
  )
);

const styles = () => ({
  subtitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    fontSize: 11,
    fontWeight: 'bold',
  },
  item: {
    display: 'flex',
  },
  label: {
    display: 'inline-block',
    flexGrow: 1,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  kbd: {
    display: 'inline-block',
    color: 'black',
    backgroundColor: 'white',
    padding: '0 8px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 'bold',
    height: 20,
    alignSelf: 'center',
    lineHeight: '20px',
  },
  category: {
    display: 'inline-flex',
    flexDirection: 'column',
    marginBottom: '2em',
    width: '100%',
  },
  content: {
    columnCount: 2,
    columnGap: '100px',
    lineHeight: '2em',
  },
});

@injectSheet(styles)
export default class ShortcutsOverlay extends React.PureComponent<Props, {}> {
  render() {
    const { classes } = this.props;

    return (
      <Overlay
        onClose={() => this.props.setVisibility(false)}
        title="Keyboard shortcuts"
        contentClassName={classes!.content}
      >
        {CATEGORIES.map((category) => {
          const shortcuts = getShortcutsByCategory(category);

          if (shortcuts.length === 0) return;
          return (
            <div className={classes!.category} key={category}>
              <h3 className={classes!.subtitle}>{category}</h3>
              <ul>
                {rejectDisabledAndInvisible(shortcuts).map(shortcut =>
                  <li className={classes!.item} key={shortcut.id}>
                    <span className={classes!.label}>{shortcut.label}</span>
                    <kbd className={classes!.kbd}>{shortcut.kbd}</kbd>
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </Overlay>
    );
  }
}
