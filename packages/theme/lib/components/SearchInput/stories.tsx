import { withInfo } from '@storybook/addon-info';
import { text, withKnobs } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { SearchInput } from './index';
import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered';

storiesOf('Molecules|SearchInput', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('Search Input',
    withInfo({ text: 'Service' })(
      withNotes('Service')(
        () => (
          <SearchInput
            placeholder={text('Placeholder', 'Type something to search...')}
            value={text('Value', '')}
            onChange={action('onChange')}
          />
        )
      )
    )
  );
