import * as React from 'react';
import centered from '@storybook/addon-centered';
import { withInfo } from '@storybook/addon-info';
import { withNotes } from '@storybook/addon-notes';
import { storiesOf } from '@storybook/react';
import { withKnobs, number, boolean, select } from '@storybook/addon-knobs';
import { useState } from '@storybook/addons';
import * as applications from '@src/components/common/ApplicationList/applications.sample.json';

import { ApplicationsList } from './ApplicationsList';

const story = storiesOf('Common| ApplicationList', module)
  .addDecorator(centered)
  .addDecorator(withKnobs);

story
  .add(
    'Default - in column',
    withInfo({ text: '' })(
      withNotes!('')(
        () => {
          return (
            <ApplicationsList
              applications={applications}
              iconSize={number('iconSize', 30)}
              marginBetweenApps={number('marginBetweenApps', 7)}
              isDockPreview={boolean('isDockPreview', false)}
              direction={select('direction', ['row', 'column'], 'column')}
            />
          );
        }
      )
    )
  )
  .add(
    'In column with dock preview',
    withInfo({ text: '' })(
      withNotes!('')(
        () => {
          const [selectedApplication, setSelectedApplication] = useState(applications);
          const onRemove = (id: string) => {
            const filteredApp = selectedApplication.filter(app => app.id !== id);
            setSelectedApplication(filteredApp);
          };

          return (
            <ApplicationsList
              applications={selectedApplication}
              onRemove={onRemove}
              iconSize={number('iconSize', 30)}
              marginBetweenApps={number('marginBetweenApps', 7)}
              isDockPreview={boolean('isDockPreview', true)}
              direction={select('direction', ['row', 'column'], 'column')}
            />
          );
        }
      )
    )
  )
  .add(
    'In row',
    withInfo({ text: '' })(
      withNotes!('')(
        () => {
          return (
            <ApplicationsList
              applications={applications}
              direction={select('direction', ['row', 'column'], 'row')}
              marginBetweenApps={number('marginBetweenApps', 11)}
            />
          );
        }
      )
    )
  );
