import { withInfo } from '@storybook/addon-info';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Service, ServiceActionType } from './index';
import { action } from '@storybook/addon-actions';

const iconPath = 'https://static.crozdesk.com/web_app_library/providers/logos/000/003/278/original/slite-1511195689-logo.png?1511195689';
const ServiceActionTypeSelect = [
  ServiceActionType.Add,
  ServiceActionType.Settings,
];

storiesOf('Molecules|Service', module)
  .addDecorator(withKnobs)
  .add('Service',
    withInfo({ text: 'Service' })(
      withNotes('Service')(
        () => (
          <Service
            key={'service'}
            service={{ id: 'slite', name: 'Slite' }}
            onAdd={action('onAdd')}
            actionType={select('Action Type', ServiceActionTypeSelect, ServiceActionType.Add)}
            subTitle={text('subtitle', '')}
            alternate={boolean('aternate', false)}
            iconPath={text('iconPath', iconPath)}
          />
        )
      )));
