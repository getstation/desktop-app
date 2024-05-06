import * as React from 'react';
import centered from '@storybook/addon-centered';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { storiesOf } from '@storybook/react';

import AppStoreAsideNavButton from './AppStoreAsideNavButton';

const story = storiesOf('Components', module)
  .addDecorator(withKnobs)
  .addDecorator(centered);

story
  .add(
    'AppStoreAsideNavButton',
    withInfo({ text: '' })(
      withNotes!('')(
        () => (
          <AppStoreAsideNavButton
            onClick={action('click')}
            isActive={boolean('isActive', true)}
            isBurgerOpen={boolean('isBurgerOpen', false)}
            iconName={text('iconName', '#i--hot')}
            title={text('title', 'Most Popular')}
            screenName={text('screenName', 'MOST_POPULAR')}
          />
        )
  )));
