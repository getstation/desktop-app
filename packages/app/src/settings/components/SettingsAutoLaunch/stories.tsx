import * as React from 'react';
import { storiesOf } from '@storybook/react';
import SettingsAutoLaunch from './SettingsAutoLaunch';

storiesOf('Screens|Settings', module)
  .add('Settings Auto Launch', () => {
    return (
      <SettingsAutoLaunch />
    );
  });
