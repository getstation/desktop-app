import { ButtonIcon } from './index';
import { IconSymbol, Size } from '../..';
import centered from '@storybook/addon-centered';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

storiesOf('Atoms|ButtonIcon', module)
  .addDecorator(withKnobs)
  .addDecorator(centered)
  .add('All sizes',
    withInfo({ text: 'All sizes' })(
      withNotes('All sizes')(
        () => {
          return (
            <>
             <ButtonIcon
              symbolId={IconSymbol.CROSS}
              btnSize={Size.BIG}
             />
             <ButtonIcon
              symbolId={IconSymbol.CROSS}
             />
              <ButtonIcon
                symbolId={IconSymbol.CROSS}
                btnSize={Size.SMALL}
              />
              <ButtonIcon
                symbolId={IconSymbol.CROSS}
                btnSize={Size.XSMALL}
              />
              <ButtonIcon
                symbolId={IconSymbol.CROSS}
                btnSize={Size.XXSMALL}
              />
              <ButtonIcon
                symbolId={IconSymbol.CROSS}
                btnSize={Size.XXXSMALL}
              />
            </>
          );
        }
      )))
  .add('With text',
    withInfo({ text: 'With text' })(
      withNotes('With text')(
        () => {
          const content = text('text', 'Add a new account');

          return (
            <>
             <ButtonIcon
              text={content}
              symbolId={IconSymbol.PLUS}
              btnSize={Size.SMALL}
             />
            </>
          );
        }
      )));
