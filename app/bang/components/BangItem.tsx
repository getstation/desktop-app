import {
  getHighlightGradient,
  Icon,
  IconSymbol,
  ThemeTypes as Theme,
} from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore no ts definitions
import injectSheet from 'react-jss';

import AppIcon from '../../dock/components/AppIcon';
import { SearchPaneItemSelectedItem } from '../duck';
import KeyHold from './KeyHold';

interface Classes {
  item: string,
  content: string,
  labelWrapper: string,
  label: string,
  context: string,
  image: string,
  caretIcon: string,
  current: string,
}

interface InjectSheetProps {
  classes: Classes,
}
export interface OwnProps {
  label: string,
  imgUrl: string,
  themeColor: string,
  type: SearchPaneItemSelectedItem,
  current?: boolean,
  context?: string,
  /**
   * Indicates that this item is currently selected,
   * for instance via keyboard navigation.
   */
  selected: boolean,
  onClick: () => void,
  ctrlTabCycling?: boolean,
  smallSize?: boolean,
}

interface State {
  isHover: boolean
}

@injectSheet((theme: Theme) => {
  const labelSize = ({ smallSize }: OwnProps) => smallSize ? 13 : 16;
  const contextSize = ({ smallSize }: OwnProps) => smallSize ? 10 : 12;
  const imageSize = ({ smallSize }: OwnProps) => smallSize ? '24px' : '30px';

  return ({
    item: {
      display: 'flex',
      height: ({ smallSize }: OwnProps) => smallSize ? 50 : 60,
      alignItems: 'center',
      padding: 20,
      '&.highlighted': {
        backgroundImage: getHighlightGradient(undefined, .50),
      },
      '&.mediumlighted': {
        backgroundImage: getHighlightGradient(undefined, .30),
      },
      '& $shortcutsButton': {
        display: 'none',
      },
      '&:hover $shortcutsButton': {
        display: 'initial',
      },
    },
    content: {
      display: 'flex',
      alignItems: 'center',
      width: '92%',
      marginLeft: 10,
      color: 'white',
    },
    labelWrapper: {
      width: '91%',
    },
    label: {
      ...theme.fontMixin(labelSize, 600),
      ...theme.mixins.ellipsis(1),
    },
    context: {
      ...theme.fontMixin(contextSize),
      marginLeft: 2,
      opacity: .5,
      ...theme.mixins.ellipsis(1),
    },
    image: {
      ...theme.avatarMixin(imageSize),
      flexShrink: 0,
      '&.placeholder': {
        content: '""',
      },
    },
    caretIcon: {
      flexGrow: 0,
    },
  });
})

class BangItem extends React.PureComponent<OwnProps & InjectSheetProps, State> {
  static defaultProps = {
    onHover: () => { },
    current: false,
    context: '',
  };

  state = {
    isHover: false,
  };

  handleCtrlClick = (e: React.MouseEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      this.props.onClick();
    }
  }

  renderImage() {
    const { imgUrl, label, type, themeColor, smallSize, classes } = this.props;

    if (!imgUrl) {
      // if no image put a placeholder
      return <span className={classNames(classes!.image, 'placeholder')} />;
    }

    if (type === 'station-app') {
      const iconSize = smallSize ? 24 : 30;

      return (
        <div className={classes!.image}>
          <AppIcon size={iconSize} imgUrl={imgUrl} themeColor={themeColor} />
        </div>
      );
    }

    return (
      <img className={classes!.image} src={imgUrl} alt={label} />
    );
  }

  setIsHover = () => this.setState({ isHover: true });
  unsetIsHover = () => this.setState({ isHover: false });

  renderButton() {
    const { classes, selected } = this.props;

    if (!selected) return;

    return (
      <KeyHold keyValue={'Alt'} >
        {() => (
          <Icon
            className={classes!.caretIcon}
            symbolId={IconSymbol.RETURN}
            size={35}
            color="rgba(255, 255, 255, .6)"
          />
        )}
      </KeyHold>
    );
  }

  render() {
    const { classes, selected, onClick, label, context } = this.props;

    return (
      <li
        onMouseEnter={this.setIsHover}
        onMouseLeave={this.unsetIsHover}
        onClick={onClick}
        onContextMenu={this.handleCtrlClick}
        className={classNames(classes!.item, {
          highlighted: selected,
          mediumlighted: !selected && this.state.isHover,
        })}
      >
        {this.renderImage()}
        <div className={classes!.content}>
          <div className={classes!.labelWrapper}>
            <p className={classes!.label}>{label || ''}</p>
            <p className={classes!.context}>{context}</p>
          </div>
          {this.renderButton()}
        </div>
      </li>
    );
  }
}

export default BangItem as React.ComponentType<OwnProps>;
