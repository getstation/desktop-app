import * as pluralize from 'pluralize';
import { compact } from 'ramda-adjunct';
import * as React from 'react';
import List from '../../../common/components/List';
import {
  ListActionType,
  ListItemActionButton,
  ListItemActionButtonIcon,
} from '../../../common/components/ListItem';
import { IconSymbol } from '../../../dock/components/NativeAppDockIcon';
import Providers from '../../../password-managers/providers/index';
import { Instance, Instances } from '../types';
import { orderInstances } from '../utils';
import { List as ListImmutable } from 'immutable';

type DefaultProps = {
  onConfigureInstance: (instanceId: string) => void,
  onRemoveInstance: (instanceId: string) => void,
  onUnlinkPasswordManager: (instanceId: string) => void,
  instanceTypeWording: string,
  applications: any,
};

type Props = DefaultProps & {
  manifestURL: string,
  instances: Instances,
};

class ListInstances extends React.Component<Props> {
  static defaultProps: DefaultProps = {
    onConfigureInstance: () => { },
    onRemoveInstance: () => { },
    onUnlinkPasswordManager: () => { },
    instanceTypeWording: 'instance',
    applications: null,
  };

  render() {
    const {
      onConfigureInstance,
      onRemoveInstance,
      onUnlinkPasswordManager,
      instances,
      instanceTypeWording,
      applications,
    } = this.props;

    const createRemoveAccountAction = (instance: Instance): ListItemActionButtonIcon => ({
      id: instance.id,
      type: ListActionType.BUTTON_ICON,
      tooltip: `Remove ${instanceTypeWording}`,
      symbolId: IconSymbol.CROSS,
      handleAction: () => onRemoveInstance(instance.id),
    });

    const createUnlinkPasswordManager = (instance: Instance): ListItemActionButton | undefined => {
      if (Boolean(instance.passwordManagerLink!.providerId)) {
        return {
          id: `passwordManager_${instance.id}`,
          type: ListActionType.BUTTON,
          text: `Unlink ${Providers[instance.passwordManagerLink!.providerId].name}`,
          handleAction: () => onUnlinkPasswordManager(instance.id),
        };
      }
      return undefined;
    };

    // Get an array of ID of docks apps.
    const applicationsList: ListImmutable<string> = applications.map(app => app.get('applicationId'));

    const items = orderInstances(instances, applicationsList)
    .map(
      (instance: Instance) => ({
        id: `removeAccount_${instance.id}`,
        name: instance.needConfiguration ? `Configure ${instanceTypeWording}` : instance.name,
        imageURL: instance.logoUrl,
        onClick: instance.needConfiguration ? () => onConfigureInstance(instance.id) : undefined,
        leftActions: [createRemoveAccountAction(instance)],
        rightActions: compact([createUnlinkPasswordManager(instance)]),
      })
    );

    return (
      <List
        iconSize={25}
        title={pluralize(instanceTypeWording)}
        items={items}
      />
    );
  }
}

export default ListInstances;
