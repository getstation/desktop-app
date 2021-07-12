import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, boolean, text, color, number } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered';

import SearchResults from './SearchResults';

const story = storiesOf('Common | Search', module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs)
  .addDecorator(centered);

const application = (i: number) => {
  return {
    id: text('ID', String(i)),
    name: text('Name', 'Google Drive'),
    categoryName: text('Category Name', 'File Provider'),
    iconURL: text('Icon URL', 'https://cdn.filestackcontent.com/J4MAUo7LRZm2fhyp6X0f'),
    themeColor: color('Theme Color', '#FCCD48'),
    isExtension: boolean('Is extension', false),
    shouldDisplayCategory: boolean('Should display category', false),
    onSelect: action('onSelect'),
  };
};

// @ts-ignore
const applications = (num: number) => Array.from(Array(num).keys()).map((v, i) => application(i));

story
  .add(
    'AppStore Search Result',
    withInfo({ text: '' })(
      withNotes('')(
        () => (
          <>
            {false && number('Number of Applications', 30)}
            < SearchResults
              applications={(() => {
                const num = number('Number of Applications', 30);
                return applications(num);
              })()}
            />
          </>

        )
      )));
