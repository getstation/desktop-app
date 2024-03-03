import * as BluebirdPromise from 'bluebird';
import { EventEmitter } from 'events';
import * as Mousetrap from 'mousetrap';
import * as React from 'react';
import { SHORTCUTS } from '../../keyboard-shortcuts';

const originalHandleKey = Mousetrap.prototype.handleKey;

const createHandleKey = (getKeyAboveTab: () => string) =>
  function (this: any, character: string, modifiers: any, e: any) {
    if (e.key === getKeyAboveTab()) {
      /* tslint:disable-next-line no-invalid-this */
      return originalHandleKey.call(this, 'KeyAboveTab', modifiers, e);
    }
    /* tslint:disable-next-line no-invalid-this */
    return originalHandleKey.call(this, character, modifiers, e);
  };

export type Props = {
  onCtrlTab: Function,
  onCtrlTabCyclingStart: Function,
  onCtrlTabCyclingStep: Function,
  onCtrlTabCyclingEnd: Function,
  onCtrlAltArrow: Function,
  onCtrlAltArrowEnd: Function,
  onCtrlNum: Function,
  onCtrlBacktick: Function,
  keyAboveTab: string,
};

export type State = {
  modifiers: {
    ctrl: boolean,
    mod: boolean,
    alt: boolean,
  },
  ctrlTabCycling: boolean,
  ctrlAltCycling: boolean,
  ctrlTabCycleCount: number,
};

export default class KeyboardShortcuts extends React.PureComponent<Props, State> {

  static defaultProps = {
    onCtrlTab: () => { },
    onCtrlTabCyclingStart: () => { },
    onCtrlTabCyclingStep: () => { },
    onCtrlTabCyclingEnd: () => { },
    onCtrlAltArrow: () => { },
    onCtrlAltArrowEnd: () => { },
    onCtrlNum: () => { },
    onCtrlBacktick: () => { },
    keyAboveTab: '',
  };

  public ctrlEmitter: EventEmitter;

  constructor(props: Props) {
    super(props);
    this.state = {
      modifiers: {
        ctrl: false,
        mod: false,
        alt: false,
      },
      ctrlTabCycling: false,
      ctrlAltCycling: false,
      ctrlTabCycleCount: 0,
    };
    this.ctrlEmitter = new EventEmitter();
  }

  componentDidMount() {
    this.watchCtrl();
    this.watchMod();
    this.watchAlt();
    this.watchCmdOrCtrlAlt();
    this.watchCtrlTab();
    this.watchCmdOrCtrlAltArrow();
    this.watchCmdOrCtrlNum();
    this.watchCtrlBacktick();

    Mousetrap.prototype.handleKey = createHandleKey(() => this.props.keyAboveTab);
  }

  // tslint:disable-next-line:function-name
  UNSAFE_componentWillUnmount() {
    this.unwatchCtrl();
    this.unwatchMod();
    this.unwatchAlt();
    this.unwatchCmdOrCtrlAlt();
    this.unwatchCtrlTab();
    this.unwatchCmdOrCtrlAltArrow();
    this.unwatchCmdOrCtrlNum();
    this.unwatchCtrlBacktick();
    Mousetrap.prototype.handleKey = originalHandleKey;
  }

  setModifierState(subState: Partial<State['modifiers']>) {
    this.setState({
      modifiers: {
        ...this.state.modifiers,
        ...subState,
      },
    });
  }

  incrementCtrlTabCycleCount() {
    this.setState({
      ctrlTabCycleCount: this.state.ctrlTabCycleCount + 1,
    });
  }

  resetCtrlTabCycleCount() {
    this.setState({ ctrlTabCycleCount: 0 });
  }

  watchCmdOrCtrlAltArrow() {
    Mousetrap.bind(SHORTCUTS['go-sibling-app'].accelerator, (e, combo) => {
      const reverse = combo.includes('left');
      this.handleControlAltArrowAndHoldCtrlAlt(reverse);
      e.preventDefault();
    });
  }

  watchCtrlTab() {
    Mousetrap.bind([<string>SHORTCUTS['cycle-app'].accelerator, <string>SHORTCUTS['cycle-app-reverse'].accelerator], (e, combo) => {
      e.preventDefault();

      const reverse = combo.includes('shift');

      if (this.state.ctrlTabCycling) {
        this.handleControlTabAndHoldCtrl(reverse);
      } else {
        new BluebirdPromise(
          (resolve) => {
            this.ctrlEmitter.once('keyup', resolve);
            setTimeout(() => {
              this.ctrlEmitter.removeListener('keyup', resolve);
            }, 101);
          })
          .timeout(100)
          .then(() => {
            // CTRL released before timeout -> Quick CTRL+TAB
            this.props.onCtrlTab(reverse);
          })
          .catch(() => {
            this.handleControlTabAndHoldCtrl(reverse);
          });
      }
    });
  }

  watchCmdOrCtrlNum() {
    Mousetrap.bind(SHORTCUTS['go-app-num'].accelerator, (_e, combo) => {
      this.props.onCtrlNum(parseInt(combo.split('+')[1], 10));
    });
  }

  handleControlTabAndHoldCtrl(reverse: boolean) {
    // we are cycling
    if (!this.state.ctrlTabCycling) {
      // first stick: start
      this.setState({ ctrlTabCycling: true });
      this.props.onCtrlTabCyclingStart();
    }
    this.incrementCtrlTabCycleCount();
    this.props.onCtrlTabCyclingStep(
      this.state.ctrlTabCycleCount,
      reverse
    );
  }

  handleControlAltArrowAndHoldCtrlAlt(reverse: boolean) {
    if (!this.state.ctrlAltCycling) {
      this.setState({ ctrlAltCycling: true });
    }
    this.props.onCtrlAltArrow(reverse);
  }

  handleCmdOrCtrlAltKeyUp() {
    if (!this.state.modifiers.mod && !this.state.modifiers.alt) {
      if (this.state.ctrlAltCycling) {
        this.setState({ ctrlAltCycling: false });
        this.props.onCtrlAltArrowEnd();
        return true;
      }
    }
    return false;
  }

  watchMod() {
    Mousetrap.bind(
      'mod',
      () => {
        this.setModifierState({ mod: true });
      },
      'keydown'
    );

    Mousetrap.bind(
      'mod',
      () => {
        this.setModifierState({ mod: false });
        this.handleCmdOrCtrlAltKeyUp();
      },
      'keyup'
    );
  }

  watchCtrl() {
    Mousetrap.bind(
      'ctrl',
      () => {
        this.setModifierState({ ctrl: true });
      },
      'keydown'
    );

    Mousetrap.bind(
      'ctrl',
      () => {
        this.ctrlEmitter.emit('keyup');
        this.setModifierState({ ctrl: false });
        if (this.state.ctrlTabCycling) {
          this.setState({ ctrlTabCycling: false });
          this.resetCtrlTabCycleCount();
          this.props.onCtrlTabCyclingEnd();
        }
      },
      'keyup'
    );
  }

  watchAlt() {
    Mousetrap.bind(
      'alt',
      () => {
        this.setModifierState({ alt: true });
      },
      'keydown'
    );

    Mousetrap.bind(
      'alt',
      () => {
        this.setModifierState({ alt: false });
        this.handleCmdOrCtrlAltKeyUp();
      },
      'keyup'
    );
  }

  watchCmdOrCtrlAlt() {
    Mousetrap.bind(
      ['mod+alt', 'alt+mod'],
      () => {
        this.setModifierState({ alt: true, mod: true });
      },
      'keydown'
    );
  }

  watchCtrlBacktick() {
    Mousetrap.bind('ctrl+KeyAboveTab', () => {
      this.props.onCtrlBacktick();
    });
  }

  unwatchCtrlTab() {
    Mousetrap.unbind([
      <string>SHORTCUTS['cycle-app'].accelerator,
      <string>SHORTCUTS['cycle-app-reverse'].accelerator,
    ]);
  }
  unwatchCtrl() {
    Mousetrap.unbind('ctrl');
  }
  unwatchMod() {
    Mousetrap.unbind('mod');
  }
  unwatchAlt() {
    Mousetrap.unbind('alt');
  }
  unwatchCmdOrCtrlAlt() {
    Mousetrap.unbind(['mod+alt', 'alt+mod']);
  }
  unwatchCmdOrCtrlAltArrow() {
    Mousetrap.unbind(SHORTCUTS['go-sibling-app'].accelerator);
  }
  unwatchCmdOrCtrlNum() {
    Mousetrap.unbind(SHORTCUTS['go-app-num'].accelerator);
  }

  unwatchCtrlBacktick() {
    Mousetrap.unbind('ctrl+`');
  }

  render() {
    return null;
  }
}
