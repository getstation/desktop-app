import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { AppDockIcon, AppearingAppDockIcon } from './AppDockIcon';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

storiesOf('Molecules|Dock', module)
  .addDecorator(withKnobs)
  .add('<AppDockIcon />', () => (
      <AppDockIcon
        active={boolean('active', false)}
        applicationId={'applicationId'}
        logoURL={text('logoURL', 'https://i.pravatar.cc/150')}
        iconURL={text('iconURL', 'https://cdn.filestackcontent.com/J4MAUo7LRZm2fhyp6X0f')}
        themeColor={text('themeColor', '#FCCD48')}
        snoozed={boolean('snoozed', false)}
        badge={text('badge', '•')}
        loading={false}
      />
));

storiesOf('Molecules|Dock', module)
  .addDecorator(withKnobs)
  .add('<AppearingAppDockIcon />', () => {
    const mount = boolean('mount', true);
    const active = boolean('active', false);
    const dramaticEnter = boolean('dramaticEnter', false);
    if (!mount) return (<span/>);
    return (
      <AppearingAppDockIcon
        active={active}
        applicationId={'applicationId'}
        iconURL={'https://cdn.filestackcontent.com/J4MAUo7LRZm2fhyp6X0f'}
        themeColor={'#FCCD48'}
        loading={false}
        dramaticEnter={dramaticEnter}
      />
    );
  });
