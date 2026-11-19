import { withInfo } from '@storybook/addon-info';
import { text, withKnobs } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { FloatingActionButton } from './index';
import { action } from '@storybook/addon-actions';
import { Icon, IconSymbol } from '../Icon';

storiesOf('Atoms|Floating Action Button', module)
  .addDecorator(withKnobs)
  .add('FAB',
    withInfo({ text: 'FAB' })(
      withNotes('FAB Component')(
        () => {
          return (
            <FloatingActionButton onClick={action('onClick')} />
          );
        }
      )))
  .add('FAB with Icon',
    withInfo({ text: 'FAB Icon' })(
      withNotes('FAB Component with Icon')(
        () => {
          return (
            <FloatingActionButton onClick={action('onClick')}>
              <Icon symbolId={IconSymbol.PLUS} color={'white'} size={30} />
            </FloatingActionButton>
          );
        }
      )))
  .add('FAB with Text',
    withInfo({ text: 'FAB Text' })(
      withNotes('FAB Component with Text')(
        () => {
          return (
            <FloatingActionButton onClick={action('onClick')}>
              {text('content', 'Add')}
            </FloatingActionButton>
          );
        }
      )));
