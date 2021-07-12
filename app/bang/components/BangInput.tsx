import { ThemeTypes as Theme } from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

interface Classes {
  label: string,
  container: string,
  input: string,
  searchIcon: string,
  navigation: string,
  navigationIcon: string,
}

export interface Props {
  classes?: Classes,
  value: string,
  onValueChange: (value: string) => void,
  onArrowDown: () => void,
  onArrowUp: () => void,
  onTab: () => void,
  onShiftTab: () => void,
  onEnter: (modifier: { altKey: boolean}) => void,
  onEscape: () => void,
  onContextMenu: (e: React.MouseEvent) => void,
  onClick: (e: React.MouseEvent) => void,
  refBangInput: (ref: BangInput | null) => void,
  shortcut?: string,
}

@injectSheet((theme: Theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '52px',
    cursor: 'text',
    padding: 20,
    borderBottom: '2px solid rgba(255,255,255,0.1)',
  },
  label: {
    cursor: 'inherit',
    flex: 1,
  },
  input: {
    width: '100%',
    cursor: 'inherit',
    appearance: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.8)',
    ...theme.fontMixin(16, 600),
    caretColor: 'rgba(255, 255, 255, 0.8)',
    '&::placeholder': {
      ...theme.fontMixin(14),
      color: 'rgba(255, 255, 255, 0.6)',
      fontStyle: 'italic',
      paddingLeft: 10,
    },
    '&:hover': {
      '&::placeholder': {
        textDecoration: 'inherit',
      },
    },
  },
  searchIcon: {
    cursor: 'inherit',
    flexGrow: 0,
    ...theme.avatarMixin('24px'),
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  navigation: {
    marginLeft: 5,
    fontSize: 10,
    color: 'rgba(255, 255, 255, .6)',
  },
  navigationIcon: {
    marginRight: 4,
    padding: [2, 4],
    background: 'rgba(255, 255, 255, .2)',
    borderRadius: 2,
    fontSize: 10,
  },
}))
export default class BangInput extends React.PureComponent<Props> {

  static defaultProps = {
    onClick: () => {},
    onContextMenu: () => {},
  };

  private inputEl: HTMLInputElement | null;

  constructor(props: Props) {
    super(props);
    this.setRef = this.setRef.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.focus = this.focus.bind(this);
  }

  setRef(ref: HTMLInputElement | null) {
    this.inputEl = ref;
  }

  focus() {
    if (this.inputEl) this.inputEl.focus();
  }

  selectAll() {
    const { value } = this.props;
    if (!value || value.length === 0) return;

    if (this.inputEl) this.inputEl.setSelectionRange(0, value.length);
  }

  blur() {
    if (this.inputEl) this.inputEl.blur();
  }

  handleTabDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey) return;
    if (e.shiftKey) {
      this.props.onShiftTab();
    } else {
      this.props.onTab();
    }
  }

  handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case 'Tab': {
        e.preventDefault();
        this.handleTabDown(e);
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        this.props.onArrowDown();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        this.props.onArrowUp();
        break;
      }
      case 'Enter': {
        e.preventDefault();
        // handling will happen on KeyUp
        // otherwile it might interfer with the app we'll focus on next
        break;
      }
      case 'Escape': {
        e.preventDefault();
        this.props.onEscape();
        break;
      }
      default:
        return;
    }
  }

  handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case 'Enter': {
        e.preventDefault();
        this.props.onEnter({
          altKey: e.getModifierState('Alt'),
        });
        break;
      }
      default:
        return;
    }
  }

  handleValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.props.onValueChange(e.target.value);
  }

  componentDidMount() {
    this.props.refBangInput(this);
  }

  render() {
    const { classes, value, onClick, onContextMenu, shortcut } = this.props;

    return (
      <div
        className={classes!.container}
        onClick={onClick}
        onContextMenu={onContextMenu}
      >
        <label className={classes!.label}>
          <input
            className={classNames(classes!.input, 'mousetrap')}
            placeholder="Jump to..."
            ref={this.setRef}
            type="text"
            value={value}
            onChange={this.handleValueChange}
            onKeyDown={this.handleKeyDown}
            onKeyUp={this.handleKeyUp}
          />
        </label>

        { shortcut &&
          <div className={classes!.navigation}>
            <span className={classes!.navigationIcon}>{shortcut}</span>
            Open
          </div>
        }
      </div>
    );
  }
}
