import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Chooser } from './index';

const arrayItems = [
  {
    title: 'Test',
    description: 'My awesome desc.',
    value: 'test',
  },
  {
    title: 'Test 2',
    description: 'My awesome desc.',
    value: 'test2',
  },
];

storiesOf('Molecules|Chooser', module)
  .addDecorator(withKnobs)
  .addDecorator(centered)
  .add('Chooser', () => (
    <Chooser items={arrayItems} onSelect={action('onSelect')}/>
  ));
