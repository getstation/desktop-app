import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, number } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered';

import AppStoreSearch from './AppStoreSearch';

const story = storiesOf('Common | Search', module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs)
  .addDecorator(centered);

const application = (i: number) => {
  return {
    id: String(i),
    name: 'Google Drive',
    categoryName: 'File Provider',
    iconURL: 'https://cdn.filestackcontent.com/J4MAUo7LRZm2fhyp6X0f',
    themeColor: '#FCCD48',
    isExtension: false,
    shouldDisplayCategory: false,
  };
};

// @ts-ignore
const applications = (num: number) => Array.from(Array(num).keys()).map((v, i) => application(i));

story
  .add(
    'AppStore Search',
    withInfo({ text: '' })(
      withNotes('')(
        () => (
          <AppStoreSearch
            applications={(() => {
              const num = number('Number of Applications', 5);
              return applications(num);
            })()}
            onQueryChange={action('On Query Change')}
            onSelectApplication={action('On Select Application')}
          />
        )
      )));
