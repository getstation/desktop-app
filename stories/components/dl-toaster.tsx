import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered';
import { boolean, number, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import DownloadToast from '../../app/dl-toaster/components/DownloadToast';

const story = storiesOf('Components|Download Toast', module);

story
  .addDecorator(withKnobs)
  .addDecorator(centered)
  .add(
    'Download Toast',
      () => (
        <DownloadToast
          applicationId={select('applicationId', ['slack', 'unknown'], 'slack')}
          failed={boolean('failed', false)}
          key="1"
          filename={text('filename', 'A very long filename')}
          completionPercent={number('completionPercent', 50)}
          onClickOpen={action('onClickOpen')}
          onClickHide={action('onClickHide')}
          themeColor="#EEEEEE"
        />
      )
    );
