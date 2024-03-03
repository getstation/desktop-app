import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, boolean, text, color } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered';
import Application from '@src/components/common/Application/Application';

const story = storiesOf('Common', module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs)
  .addDecorator(centered);

story
  .add(
    'Application',
    withInfo({ text: '' })(
      withNotes('')(
        () => (
          <Application
            id={text('ID', '123')}
            name={text('Name', 'Google Drive')}
            categoryName={text('Category Name', 'File Provider')}
            iconURL={text('Icon URL', 'https://cdn.filestackcontent.com/J4MAUo7LRZm2fhyp6X0f')}
            themeColor={color('Theme Color', '#FCCD48')}
            isExtension={boolean('Is extension', false)}
            shouldDisplayCategory={boolean('Should display category', false)}
            onSelect={action('onSelect')}
          />
        )
      )));
