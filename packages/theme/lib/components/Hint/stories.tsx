import centered from '@storybook/addon-centered';
import { withInfo } from '@storybook/addon-info';
import { number, select, text, withKnobs } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Hint, STYLE } from './index';

storiesOf('Atoms|Hint', module)
  .addDecorator(withKnobs)
  .addDecorator(centered)
  .add('Hint',
    withInfo({ text: 'Hint' })(
      withNotes('A very simple component')(
        () => {
          const tooltip = text('Tooltip', 'This is a hint');
          const style = select('Style', STYLE, STYLE.DARK);
          const size = number('Size', 15);

          return (
            <Hint tooltip={tooltip} style={style} size={size}>
                Hint
            </Hint>
          );
        }
      )));
