import centered from '@storybook/addon-centered';
import { withInfo } from '@storybook/addon-info';
import { text, withKnobs } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Input, InputType } from './index';

storiesOf('Atoms|Input', module)
  .addDecorator(withKnobs)
  .addDecorator(centered)
  .add('Input Normal',
    withInfo({ text: 'Input Normal' })(
      withNotes('Input - Normal style')(
        () => (
          <Input
            type={InputType.TEXT}
            value={text('value', 'Trello')}
          />
        )
      )))
  .add('Input Error',
    withInfo({ text: 'Input Error' })(
      withNotes('Input - Error style')(
        () => (
          <Input
            type={InputType.TEXT}
            label={text('label', 'Email')}
            value={text('value', 'Trello')}
            error={text('Error', 'invalid value')}
          />
        )
      )));
