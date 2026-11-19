import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { ChooserItem } from './index';

const item = {
  title: 'Test',
  description: 'My awesome desc.',
  value: 'test',
};

storiesOf('Molecules|ChooserItem', module)
  .addDecorator(withKnobs)
  .addDecorator(centered)
  .add('ChooserItem', () => (
    <ChooserItem item={item} onSelect={action('onSelect')}/>
  ));
