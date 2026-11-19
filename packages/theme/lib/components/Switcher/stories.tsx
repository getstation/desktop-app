import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered';
import { withInfo } from '@storybook/addon-info';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Switcher, TEXT } from './index';

storiesOf('Atoms|Switcher', module)
  .addDecorator(withKnobs)
  .addDecorator(centered)
  .add('Switcher',
    withInfo({ text: 'Switcher' })(
      withNotes('A very simple component')(
        () => {
          const switcherText = select('Text', TEXT, TEXT.ON_OFF);

          return (
            <Switcher
                checked={boolean('checked', true)}
                onChange={action('onChange')}
                disabled={boolean('disabled', false)}
                disabledHint={text('disabledHint', '')}
                text={switcherText}
            />
          );
        }
      )));
