import { COLORS, getGradientWithOverlay, Theme } from '@getstation/theme';
import { action } from '@storybook/addon-actions';
import { select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import DockApplicationSubdock from '../../app/common/containers/DockApplicationSubdock';
import Portal from '../../app/common/containers/Portal';
import AppContainer from '../commons/AppContainer';

storiesOf('Components|Subdock Application', module)
  .addDecorator(withKnobs)
  .add('Subdock Application', () => {
    const theme = select('Theme', Theme, 'dawn');
    const gradient = getGradientWithOverlay(COLORS.get(theme).colors, 0.3);

    return (
      <AppContainer>
        <DockApplicationSubdock
          open={true}
          onRequestClose={action('onRequestClose')}
          themeGradient={gradient}
        >
          <div/>

          <div>Subdock Application content</div>
        </DockApplicationSubdock>

        <Portal into="storybook-portal"/>
      </AppContainer>
    );
  });
