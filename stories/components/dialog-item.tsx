import { IconSymbol, Style } from '@getstation/theme';
import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered';
import { object, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import DialogItem from '../../app/dialogs/components/DialogItem';
import { fromJS } from '../../app/utils/ts';

const story = storiesOf('Components|Dialog Item', module);

const dialogMessage = 'Meeting w/ Alex (Hugo Mano) is starting at 13:00pm ' +
  '+ additional zevia text, we love beer and croutenard ! This is a long message';

story
  .addDecorator(withKnobs)
  .addDecorator(centered)
  .add(
    'Google Calendar Notification',
    () => (
      <DialogItem
        dialog={object!('Dialog', fromJS({
          id: '1',
          title: 'title',
          message: 'message',
          tabId: '1',
          actions: [
            { onClick: 'close', icon: IconSymbol.CROSS, style: Style.PRIMARY },
            { onClick: 'open-tab', icon: IconSymbol.SHOW, style: Style.SECONDARY },
          ],
          application: {
            applicationId: '1',
            name: 'Google Calendar',
            iconURL: 'http://via.placeholder.com/33x33',
          } as any,
        }))}
        onClickDialog={action('clicked')}
        themeColor={text('themeColor', '#F1B87C')}
      />
    )
  )
  .add(
    'Google Calendar Notification (long word)',
    () => (
      <DialogItem
        dialog={object!('Dialog', fromJS({
          id: '1',
          title: 'title',
          message: dialogMessage.split(' ').join(''),
          tabId: '1',
          actions: [
            { onClick: 'close', icon: IconSymbol.CROSS, style: Style.PRIMARY },
            { onClick: 'open-tab', icon: IconSymbol.SHOW, style: Style.SECONDARY },
          ],
          application: {
            applicationId: '1',
            name: 'Google Calendar',
            iconURL: 'http://via.placeholder.com/33x33',
          } as any,
        }))}
        onClickDialog={action('clicked')}
        themeColor={text('themeColor', '#F1B87C')}
      />
    ),
  )
  .add(
    'Opt out Installation Confirmation',
    () => (
      <DialogItem
        dialog={object!('Dialog', fromJS({
          id: '1',
          title: 'We just added Slack to your Station. Would you like to keep it there?',
          message: 'You can  always add it manually from the app store',
          tabId: '1',
          actions: [
            { onClick: 'open-tab', text: 'No, open in my browser', style: Style.TERTIARY },
            { onClick: 'open-tab', text: 'Yes, awesome!', style: Style.PRIMARY },
          ],
          application: {
            applicationId: '1',
            name: 'Slack',
            iconURL: 'http://via.placeholder.com/33x33',
          } as any,
        }))}
        onClickDialog={action('clicked')}
        themeColor={text('themeColor', '#F1B87C')}
      />
  ),
  {
    info: { text: 'This is the Focus Icon component' },
    notes: 'A very simple component',
  });
