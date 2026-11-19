import { boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { ModalWrapper } from './index';

const containerStyle = {
  padding: 40,
  backgroundColor: 'white',
  borderRadius: 8,
  border: '1px solid',
};

storiesOf('Molecules|Modal Wrapper', module)
  .addDecorator(withKnobs)
  .add('Modal Wrapper', () => (
    <ModalWrapper backgroundOverlay={boolean('backgroundOverlay', true)}>
      <div style={containerStyle}>Modal Wrapper</div>
    </ModalWrapper>
  ));
