import * as React from 'react';
import centered from '@storybook/addon-centered';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import { select, text, withKnobs } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { storiesOf } from '@storybook/react';
import { IconSymbol } from '@getstation/theme';
import { ButtonWithIcon } from '@src/components/common/ButtonWithIcon/ButtonWithIcon';

const story = storiesOf('Common', module)
.addDecorator(withKnobs)
.addDecorator(centered);

story
.add(
  'ButtonWithIcon',
  withInfo({ text: '' })(
    withNotes!('')(
      () => (
        <ButtonWithIcon
          icon={select('icon', IconSymbol, IconSymbol.PLUS)}
          label={text('label', 'Onboard a new employee')}
          onClick={action('click')}
        />
      )
    )));
