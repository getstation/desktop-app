import { IconSymbol, ThemeTypes as Theme, Tooltip } from '@getstation/theme';
// @ts-ignore: no declaration file
import * as bind from 'memoize-bind';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import NativeAppDockIcon, { Size } from '../../dock/components/NativeAppDockIcon';
import { SHORTCUTS } from '../../keyboard-shortcuts';

export interface Classes {
  container: string,
}

export interface Props {
  classes?: Classes,
  canGoBack: boolean,
  canGoForward: boolean,
  onGoBack: () => any,
  onGoForward: () => any,
}

const styles = (_theme: Theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '2px 0',
    height: 24,
    '& button': {
      padding: [0, 5],
    },
  },
});

// remove the whitespace between ⌘ and T
const kbdBack = SHORTCUTS['page-go-back'].kbd.replace(/\s/g, '');
const kbdForth = SHORTCUTS['page-go-forward'].kbd.replace(/\s/g, '');
const tootipGoBack = `Go back ${kbdBack}`;
const tootipGoForth = `Go forward ${kbdForth}`;

@injectSheet(styles)
export default class DockNavigationButtons extends React.PureComponent<Props, {}> {
  render() {
    const { classes, canGoBack, canGoForward, onGoBack, onGoForward } = this.props;

    return (
      <div className={classes!.container}>
        <Tooltip tooltip={tootipGoBack} offset="0, 25">
          <NativeAppDockIcon
            iconSymbolId={IconSymbol.ARROW_LEFT}
            onClick={bind(() => canGoBack ? onGoBack() : null)}
            disabled={!canGoBack}
            size={Size.HALF}
          />
        </Tooltip>
        <Tooltip tooltip={tootipGoForth} offset="0, 5">
          <NativeAppDockIcon
            iconSymbolId={IconSymbol.ARROW_RIGHT}
            onClick={bind(() => canGoForward ? onGoForward() : null)}
            disabled={!canGoForward}
            size={Size.HALF}
          />
        </Tooltip>
      </div>
    );
  }
}
