import { Modal } from '@getstation/theme';
import * as Immutable from 'immutable';
import * as pluralize from 'pluralize';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import List from '../../../common/components/List';
import { ListItemType } from '../../../common/components/ListItem';
import { Instances, Instance } from '../types';
import { withInstanceNumber } from '../utils';

type Classes = {
  modalBodyContent?: string,
  hintText?: string,
};

type DefaultProps = {
  classes: Classes,
  allInstancesRemoved: boolean,
  instancesToRemove: Instances,
  instanceTypeWording: string,
  onContinue: () => void,
  onCancel: () => void,
};

type Props = DefaultProps & {
  applicationName: string,
};

@injectSheet(() => ({
  modalBodyContent: {
    display: 'flex',
    flexFlow: 'wrap',
    textAlign: 'center',
    justifyContent: 'center',
  },
  hintText: {
    paddingTop: '20px',
    width: '100%',
    color: '#949494',
  },
}))
class RemoveModalConfirmation extends React.Component<Props> {
  static defaultProps: DefaultProps = {
    classes: {},
    allInstancesRemoved: false,
    instancesToRemove: Immutable.List(),
    instanceTypeWording: 'instance',
    onContinue: () => { },
    onCancel: () => { },
  };

  getInstanceTypeWording = () => pluralize(this.props.instanceTypeWording, this.props.instancesToRemove.size);

  getPluralForm = () => this.props.instancesToRemove.size > 1;

  getItems = (): Immutable.Iterable<number, ListItemType> =>
    withInstanceNumber(this.props.instancesToRemove).map((instance: Instance) => ({
      id: instance.id,
      name: instance.needConfiguration ? `${this.props.applicationName} (Not connected)` : instance.name,
      imageURL: instance.logoUrl,
    }))

  getTitle = (): string => {
    const { allInstancesRemoved, applicationName } = this.props;

    return allInstancesRemoved ?
      `Remove ${applicationName}` :
      `Remove this ${applicationName} ${this.getInstanceTypeWording()}?`;
  }

  getDescription = (): string | undefined => {
    const { applicationName } = this.props;
    const pluralForm = this.getPluralForm();
    const instanceTypeWording = this.getInstanceTypeWording();
    const description = `Are you sure you want to remove ${pluralForm ? 'these' : 'this'} ${applicationName} ${instanceTypeWording}?`;

    return this.props.allInstancesRemoved ? description : undefined;
  }

  getContinueContent = () => {
    return `Remove ${this.getPluralForm() ? 'these' : 'this'} ${this.getInstanceTypeWording()}`;
  }

  getHintText = () => {
    const { allInstancesRemoved } = this.props;
    const pluralForm = this.getPluralForm();

    return `No worries, you can always add ${pluralForm ? 'them' : 'it'} back from the ${allInstancesRemoved ? 'app store' : 'settings'}.`;
  }

  shouldRenderModal = () => {
    const { applicationName, instancesToRemove } = this.props;
    return applicationName && instancesToRemove.size > 0;
  }

  render() {
    const { classes, onContinue, onCancel } = this.props;

    if (this.shouldRenderModal()) {
      return (
        <Modal
          title={this.getTitle()}
          description={this.getDescription()}
          onCancel={onCancel}
          onContinue={onContinue}
          cancelContent={'Cancel'}
          continueContent={this.getContinueContent()}
          continueDanger={true}
        >
          <div className={classes.modalBodyContent}>
            <List
              iconSize={25}
              items={this.getItems()}
            />
            <p className={classes.hintText}>
              {this.getHintText()}
            </p>
          </div>
        </Modal>
      );
    }
    return null;
  }
}

export default RemoveModalConfirmation;
