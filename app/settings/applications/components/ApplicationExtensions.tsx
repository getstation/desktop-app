import * as Immutable from 'immutable';
import * as React from 'react';
import List from '../../../common/components/List';
import {
  ListActionType,
  ListItemActionSwitcher,
  ListItemType,
} from '../../../common/components/ListItem';

import { Extension } from '../types';

export interface Props {
  extensions: Extension[],
  onExtensionToggle: (manifestURL: string, added: boolean) => any
}

export default class ApplicationExtensions extends React.PureComponent<Props, {}> {
  render() {
    const {
      extensions,
      onExtensionToggle,
    } = this.props;

    if (extensions.length === 0) return null;

    const createToggleExtensionAction = (extension: Extension): ListItemActionSwitcher => ({
      id: extension.name,
      type: ListActionType.SWITCHER,
      checked: extension.added,
      handleAction: () =>
        onExtensionToggle(extension.manifestURL, !extension.added),
    });

    const items: Immutable.Iterable<number, ListItemType> = Immutable.Iterable(extensions)
      .map((extension: Extension) => ({
        id: extension.id,
        name: extension.name,
        imageURL: extension.iconUrl,
        rightActions: [createToggleExtensionAction(extension)],
      }));

    return (
      <List
        iconSize={25}
        title="extensions"
        items={items}
      />
    );
  }
}
