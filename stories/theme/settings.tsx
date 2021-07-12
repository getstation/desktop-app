import { number, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import SettingsOverlay from '../../app/settings/Container';
import AppContainer from '../commons/AppContainer';

storiesOf('Theme|Settings', module)
  .addDecorator(withKnobs)
  .add('Overlay', () => (
    <AppContainer>
      <SettingsOverlay activeTabTitle={number('Active tab title', 'General')} />
    </AppContainer>
  ));
