import * as React from 'react';
import centered from '@storybook/addon-centered';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { storiesOf } from '@storybook/react';

import AppRequestError from './AppRequestError';

const story = storiesOf('Components', module)
  .addDecorator(withKnobs)
  .addDecorator(centered);

story
  .add(
    'AppRequestError',
    withInfo({ text: '' })(
      withNotes!('')(
        () => (
          <AppRequestError />
        )
  )));
