import centered from '@storybook/addon-centered';
import { withInfo } from '@storybook/addon-info';
import { text, withKnobs } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { storiesOf } from '@storybook/react';
// import PopperJS from 'popper.js';
import * as React from 'react';
import { Tooltip } from './index';
import { Icon, IconSymbol } from '../Icon';

storiesOf('Atoms|Tooltip', module)
  .addDecorator(withKnobs)
  .addDecorator(centered)
  .add('Tooltip',
    withInfo({ text: 'Tooltip' })(
      withNotes('A very simple component')(
        () => {
          const tooltip = text('Tooltip', 'This is a tooltip');
          // const placement = text('Placement', 'auto'); TODO: fix type issues with PopperJS.Placement
          const offset = text('Offset', '0, 0, 0, 0');

          return (
            <Tooltip tooltip={tooltip} offset={offset}>
              <Icon symbolId={IconSymbol.BELL} color={'#FFF'} size={40}/>
            </Tooltip>
          );
        }
      )))
  .add('Tooltip Alternate',
    withInfo({ text: 'Tooltip Alternate' })(
      withNotes('A very simple component')(
        () => {
          const tooltip = text('Tooltip', 'This is an alternate tooltip');
          // const placement = text('Placement', 'auto'); TODO: fix type issues with PopperJS.Placement
          const offset = text('Offset', '0, 0, 0, 0');
          // tslint:disable-next-line:max-line-length
          const gradient = 'linear-gradient(-180deg, rgba(0,0,0,0.3) 0vh, rgba(0,0,0,0.3) 100vh), linear-gradient(-180deg, #85A9C4 0vh, #C5C7C6 22vh, #DFD2C0 58vh, #F1B87C 100vh)';

          return (
            <Tooltip tooltip={tooltip} offset={offset} alternate={true} themeGradient={gradient}>
              <Icon symbolId={IconSymbol.BELL} color={'#FFF'} size={40}/>
            </Tooltip>
          );
        }
      )));
