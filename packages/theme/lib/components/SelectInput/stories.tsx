import centered from '@storybook/addon-centered';
import { withInfo } from '@storybook/addon-info';
import { text, withKnobs } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { SelectInput } from './index';
import { action } from '@storybook/addon-actions';
import { Modal } from '../Modal';

const renderSelectInput = (error?: string) => {
  return (
  <SelectInput
    options={[
      { value: '0', label: 'Guillaume Arm', picture: 'https://dgivdslhqe3qo.cloudfront.net/careers/members/15768/thumb_avatar_1558702997.png' },
      { value: '1', label: 'Hugo Mano', picture: 'https://dgivdslhqe3qo.cloudfront.net/careers/members/15767/thumb_avatar_1558702986.png' },
      { value: '2', label: 'Maud Miguet', picture: 'https://dgivdslhqe3qo.cloudfront.net/careers/members/15764/thumb_avatar_1558702913.png' },
      { value: '3', label: 'Alexandre Lachèze', picture: 'https://dgivdslhqe3qo.cloudfront.net/careers/members/15763/thumb_avatar_1558702855.png' },
      { value: '4', label: 'Mikaël Atier' },
      { value: '5', label: 'Julien Berthomier', picture: 'https://dgivdslhqe3qo.cloudfront.net/careers/members/15766/thumb_avatar_1558702979.png' },
      { value: '6', label: 'Joël Charles', picture: 'https://dgivdslhqe3qo.cloudfront.net/careers/members/12181/thumb_avatar_1558702850.png' },
      { value: '7', label: 'Mathias D', picture: 'https://dgivdslhqe3qo.cloudfront.net/careers/members/17076/thumb_avatar_1567069484.jpg' },
    ]}
    value={null}
    label={'Select'}
    onChange={action('onChange')}
    placeholder="Search members from your organization"
    noOptionsMessage="No one found."
    error={error}
  />);
};

storiesOf('Molecules|SelectInput', module)
  .addDecorator(withKnobs)
  .addDecorator(centered)
  .add('Select Input',
    withInfo({ text: 'Select Input' })(
      withNotes('Select Input - Base')(
        () => (
          renderSelectInput()
        )
      )))
  .add('Select Input in a Modal', () => (
    <Modal
      title={text('Title', 'My modal')}
      onCancel={action('cancel')}
      onContinue={action('continue')}
    >
      <div>
        <p>{text('Content', 'Content of the modal with a SelectInput.')}</p>
        {renderSelectInput()}
      </div>
    </Modal>
  ))
  .add('Select Input with error', () => (
    renderSelectInput('Field required')
  ));
