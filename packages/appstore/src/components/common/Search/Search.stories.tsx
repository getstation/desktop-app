import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, text } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered';

import Search from './Search';

const story = storiesOf('Common | Search', module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs)
  .addDecorator(centered);

story
.add(
  'Search',
  withInfo({ text: '' })(
    withNotes('')(
      () => (
        <Search
          query={text('query', 'notion')}
          onQueryChange={action('onQueryChange')}
        />
      )
    )));
