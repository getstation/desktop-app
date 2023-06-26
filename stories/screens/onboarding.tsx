import { action } from '@storybook/addon-actions';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import OnboardingPresenter from '../../app/onboarding/Presenter';
import { validateEmail } from '../fixtures/helpers';
import { myOrganization, applications } from '../fixtures/user-data';

storiesOf('Screens|Onboarding', module)
  .addDecorator(withKnobs)
  .add('Presenter', () => (
    <OnboardingPresenter
      applications={applications}
      onClickLogin={action('onClickLogin')}
      error={text('Error', '')}
      showWelcomeBack={boolean('Show Welcome Back', false)}
      firstName={text('First Name', 'Abdel')}
      step={number('Step', 0)}
      onRequestSharing={action('onRequestSharing')}
      onFinishStepInvitation={action('onFinishStepInvitation')}
      onAppStoreStepFinished={action('onAppStoreStepFinished')}
      emails={['abdel@gmail.com', 'bilal@gmail.com', 'cheb@gmail.com']}
      myOrganization={myOrganization}
      onEmailsChange={action('onEmailsChange')}
      loginButtonDisabled={boolean('loginButtonDisabled', false)}
      isWindowFocused={boolean('Is Window Focused', true)}
      onCloseWindow={action('onCloseWindow')}
      onMinimizeWindow={action('onMinimizeWindow')}
      onExpandWindow={action('onExpandWindow')}
      isDarwin={boolean('is Darwin', true)}
      validateEmail={validateEmail}
      privacyPoliciesLink={'https://github.com/getstation/desktop-app/wiki/FAQ#-data--privacy'}
      searchInputValue={text('searchInputValue', '')}
      handleSearchInputValue={action('handleSearchInputValue')}
    />
  ));
