import classNames from 'classnames';
import * as React from 'react';
import injectSheet, { WithSheet } from 'react-jss';
import { ChooserItemTypes, createStyles, ThemeTypes } from '../../types';
import { Button, Size as ButtonSize, Style as ButtonStyle } from '../Button';

export enum ChooserItemStyle {
  PRIMARY, SECONDARY,
}

interface OwnProps {
  item: ChooserItemTypes,
  onSelect: (item: any) => any,
  style?: ChooserItemStyle,
  selectText?: string,
}

const styles = (theme: ThemeTypes) => createStyles({
  chooserItem: {
    margin: '10px auto 10px',
    position: 'relative',
    display: 'flex',
    verticalAlign: 'middle',
    justifyContent: 'space-between',
    border: `1px solid ${theme.colors.gray.light}`,
    borderRadius: theme.$borderRadius,
    padding: 10,
    minWidth: '180px',
    ...theme.fontMixin(13),
    '&:hover': {
      backgroundColor: theme.colors.gray.light,
    },
  },
  info: {
    marginRight: '15px',
  },
  title: {
    margin: 'auto',
    fontWeight: 500,
  },
  description: {
    color: theme.colors.gray.middle,
  },
  chooserPrimary: {
  },
  chooserSecondary: {
    border: 0,
    backgroundColor: 'rgba(255,255,255, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255, 0.2)',
    },
    '& description': {
      color: theme.colors.gray.light,
    },
  },
});

type Props = OwnProps & WithSheet<typeof styles>;

class ChooserItemImpl extends React.PureComponent<Props, {}> {
  static defaultProps = {
    style: ChooserItemStyle.PRIMARY,
    implicit: true,
  };

  handleClickSelect = () => {
    const { onSelect, item } = this.props;
    onSelect(item.value);
  }

  render() {
    const { classes, style, item, selectText } = this.props;

    const styleClassNames = {
      [ChooserItemStyle.PRIMARY]: classes!.chooserPrimary,
      [ChooserItemStyle.SECONDARY]: classes!.chooserSecondary,
    };

    return (
      <div className={classNames(classes!.chooserItem, styleClassNames[style!])}>
        <div className={classes!.info}>
          <p className={classes!.title}>{item.title}</p>

          { item.description &&
          <small className={classes!.description}>
            {item.description}
          </small>
          }
        </div>

        <Button
          onClick={this.handleClickSelect}
          btnStyle={style === ChooserItemStyle.SECONDARY ? ButtonStyle.SECONDARY : ButtonStyle.PRIMARY}
          btnSize={ButtonSize.SMALL}
        >
          {selectText || 'Select'}
        </Button>
      </div>
    );
  }
}

export const ChooserItem = injectSheet(styles)(ChooserItemImpl);
