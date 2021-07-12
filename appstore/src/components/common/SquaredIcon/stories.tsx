import * as React from 'react';
import centered from '@storybook/addon-centered';
import { withInfo } from '@storybook/addon-info';
import { select, text, withKnobs } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { storiesOf } from '@storybook/react';
import { IconSymbol } from '@getstation/theme';
import { action } from '@storybook/addon-actions';
import SquaredIcon from '@src/components/common/SquaredIcon/SquaredIcon';

const story = storiesOf('Common', module)
.addDecorator(withKnobs)
.addDecorator(centered);

story
.add(
  'SquaredIcon',
  withInfo({ text: '' })(
    withNotes!('')(
      () => (
        <SquaredIcon
          icon={select('icon', IconSymbol, IconSymbol.SEND)}
          onClick={action('click')}
          tooltip={text('tooltip', 'this is tooltip')}
        />
      )
    )));
