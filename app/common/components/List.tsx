import { ThemeTypes } from '@getstation/theme';
import { Iterable } from 'immutable';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import ListItem, { ListItemType } from './ListItem';

interface Classes {
  container: string,
  title: string,
  itemsWrapper: string,
}

type Props = {
  classes?: Classes,
  title?: string,
  iconSize?: number,
  items: Iterable<number, ListItemType>,
};

@injectSheet((theme: ThemeTypes) => ({
  container: {
  },
  title: {
    ...theme.fontMixin(12, 600),
    margin: [20, 0, 10],
    textTransform: 'uppercase',
  },
  itemsWrapper: {
  },
}))
export default class List extends React.PureComponent<Props, {}> {
  render() {
    const { classes, title, items, iconSize } = this.props;

    return (
      <div className={classes!.container}>
        {title && <div className={classes!.title}>{title}</div>}

        <ul className={classes!.itemsWrapper}>
          { items.map((item: ListItemType) =>
            <ListItem key={item.id} iconSize={iconSize} item={item} />
          )}
        </ul>
      </div>
    );
  }
}
