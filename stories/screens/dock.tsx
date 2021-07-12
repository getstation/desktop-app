import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import DockWrapper from '../../app/dock/components/DockWrapper';
import TrafficLights from '../../app/dock/components/TrafficLights';
import RecentDockContainer from '../../app/dock/components/RecentDockContainer';

storiesOf('Screens|Dock', module)
  .addDecorator(withKnobs)
  .add('Dock', () => (
    <DockWrapper onClickDock={action('onClickDock')}>
      <TrafficLights
        focused={true}
        handleClose={action('TrafficLightshandleClose')}
        handleMinimize={action('TrafficLightsHandleMinimize')}
        handleExpand={action('TrafficLightsHandleExpand')}
      />

      <RecentDockContainer />
    </DockWrapper>
  ));
