import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import OnboardingStepLoginReturn from './OnboardingStepLoginReturn';
import OnboardingStepOnboardee from './OnboardingStepOnboardee';
import OnboardeeDescriptionPopup from './OnboardeeDescriptionPopup';
import { action } from '@storybook/addon-actions';

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#EEE',
  width: '100vw',
  height: '100vh',
};

storiesOf('Screens|Onboarding', module)
  .addDecorator(withKnobs)
  .add('OnboardingStepLoginReturn', () => (
    <OnboardingStepLoginReturn
      onClickTryAgain={action('onClickTryAgain')}
      errorMessage={text('errorMessage', null)}
    />
    )
  )
  .add('OnboardingStepOnboardee', () => (
    <OnboardingStepOnboardee
      onValidSubmit={action('onValidSubmit')}
      isLoading={boolean('isLoading', false)}
      active={boolean('active', true)}
      onboardee={{
        id: '???',
        firstname: 'Guillaume',
        welcomeMessage: text('welcomeMessage', '__Hello__, this is a _simple_ welcome message  :joy::):P:ok::x::v:'),
        onboarderEmployee: {
          auth0User: {
            given_name: 'Guillaume',
            family_name: 'ARM',
            picture: 'https://s3.eu-west-2.amazonaws.com/getstation.com/public/assets/logo-station.png',
          },
        },
        assignedApplications: [],
      }}
      myOrganization={{
        name: 'Station',
        pictureUrl: 'https://s3.eu-west-2.amazonaws.com/getstation.com/public/assets/logo-station.png',
      } as any}
    />
    ), { backgrounds: [] }
  )
  .add('OnboardeeDescriptionPopup', () => (
    <div style={containerStyle}>
      <OnboardeeDescriptionPopup
        description={text('Description', 'We use Google Drive for internal' +
          ' filing in the Marketing Team. If you have any question reachout' +
          ' Dan.')}
        companyLogo={text('Company Logo URL', 'https://startupstash.com/wp-content/uploads/2018/07/22.6frontapp_a.png')}
        onboarderFirstName={text('Onboarder Firstname', 'Alexandre')}
        onClick={action('onClickGotIt')}
      />
    </div>
    )
  );
