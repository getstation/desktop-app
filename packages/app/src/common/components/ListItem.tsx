import { Button, IconSymbol, Style, Switcher, ThemeTypes, Tooltip, ButtonIcon, Size } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

interface Classes {
  actions: string,
  item: string,
  itemContent: string,
  itemImg: string,
  itemBody: string,
  itemActionsLeft: string,
  itemActionsRight: string,
  itemAction: string,
}

export enum ListActionType {
  BUTTON, BUTTON_ICON, SWITCHER,
}

export type ListItemActionButtonIcon = {
  id: string,
  type: ListActionType.BUTTON_ICON,
  tooltip?: string,
  text?: string,
  symbolId: IconSymbol,
  handleAction: () => any,
};

export type ListItemActionButton = {
  id: string,
  type: ListActionType.BUTTON,
  tooltip?: string,
  text: string,
  btnStyle?: Style,
  handleAction: () => any,
};

export type ListItemActionSwitcher = {
  id: string,
  type: ListActionType.SWITCHER,
  checked: boolean,
  handleAction: () => any,
};

export type ListItemAction = ListItemActionButton | ListItemActionButtonIcon | ListItemActionSwitcher;

export type ListItemType = {
  id: string,
  imageURL?: string,
  name: string,
  onClick?: () => void,
  leftActions?: ListItemAction[],
  rightActions?: ListItemAction[],
};

type DefaultProps = {
  iconSize: number,
};

type Props = DefaultProps & {
  classes?: Classes,
  item: ListItemType,
};

@injectSheet((theme: ThemeTypes) => ({
  item: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
  },
  actions: {
    width: '100%',
  },
  itemContent: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    minWidth: (props: Props) => {
      const leftActions = props.item.leftActions || [];
      const rightActions = props.item.rightActions || [];
      const hasActions = Boolean(leftActions.length || rightActions.length);
      return hasActions ? '300px' : '0px';
    },
    maxWidth: '300px',
    width: '80%',
  },
  itemImg: (props: Props) => ({
    flexShrink: 0,
    ...theme.mixins.size(props.iconSize),
    marginRight: 5,
    display: 'inline-block',
    verticalAlign: 'middle',
    borderRadius: 100,
    border: '2px solid white',
  }),
  itemBody: ({ item }: Props) => ({
    textDecoration: item.onClick ? 'underline' : 'inherit',
    cursor: item.onClick ? 'pointer' : 'inherit',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  itemActionsLeft: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  itemActionsRight: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  itemAction: {
    display: 'inline-block',
    marginLeft: 5,
  },
}))
export default class ListItem extends React.PureComponent<Props, {}> {
  static defaultProps: DefaultProps = {
    iconSize: 20,
  };

  renderButtonIcon(action: ListItemActionButtonIcon) {
    const { classes } = this.props;
    const buttonIcon = (
      <ButtonIcon
        key={action.id}
        symbolId={action.symbolId}
        btnSize={Size.XXSMALL}
        btnStyle={Style.SECONDARY}
        onClick={action.handleAction}
        text={action.text}
      />
    );
    if (action.tooltip) {
      return (
        <Tooltip className={classes!.itemAction} key={action.id} tooltip={action.tooltip} offset="-2, 12" placement="right">
          {buttonIcon}
        </Tooltip>
      );
    }
    return buttonIcon;
  }

  renderButton(action: ListItemActionButton) {
    const { classes } = this.props;
    const btnStyle = action.btnStyle || Style.SECONDARY;
    const buttonIcon = (
      <Button btnStyle={btnStyle} key={action.id} btnSize={Size.XXSMALL} onClick={action.handleAction}>
        {action.text}
      </Button>
    );
    if (action.tooltip) {
      return (
        <Tooltip className={classes!.itemAction} key={action.id} tooltip={action.tooltip} placement={'top'} offset="0, 4">
          {buttonIcon}
        </Tooltip>
      );
    }
    return buttonIcon;
  }

  renderSwitcher(action: ListItemActionSwitcher) {
    return (
      <Switcher key={action.id} checked={action.checked} onChange={action.handleAction} />
    );
  }

  renderActions(actions: undefined | ListItemAction[], className: string) {
    const { classes } = this.props;
    if (actions) {
      return (
        <div className={classes!.actions}>
          <div className={className}>
            {
              actions.map((action: ListItemAction) => {
                switch (action.type) {
                  case ListActionType.BUTTON_ICON:
                    return this.renderButtonIcon(action);
                  case ListActionType.SWITCHER:
                    return this.renderSwitcher(action);
                  case ListActionType.BUTTON:
                    return this.renderButton(action);
                  default:
                    return null;
                }
              })
            }
          </div>
        </div>
      );
    }
    return null;
  }

  render() {
    const { classes, item } = this.props;

    return (
      <li className={classes!.item}>
        <div className={classes!.itemContent}>
          {item.imageURL && <img className={classes!.itemImg} src={item.imageURL} alt={item.name} />}
          <span onClick={item.onClick} className={classes!.itemBody}>{item.name}</span>
        </div>

        {this.renderActions(item.leftActions, classes!.itemActionsLeft!)}
        {this.renderActions(item.rightActions, classes!.itemActionsRight!)}
      </li>
    );
  }
}
