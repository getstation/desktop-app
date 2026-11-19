import { number, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered';
import * as React from 'react';
import { SlideX } from './index';

const containerStyle = {
  padding: 40,
  'box-sizing': 'border-box',
  backgroundColor: 'white',
  borderRadius: 8,
  border: '1px solid',
};

storiesOf('Molecules|SlideX', module)
  .addDecorator(withKnobs)
  .addDecorator(centered)
  .add('Slides', () => (
    <SlideX step={number('step', 0)}>
      <div style={containerStyle}>First Step</div>
      <div style={containerStyle}>Second Step</div>
      <div style={containerStyle}>Third Step</div>
    </SlideX>
  ));
