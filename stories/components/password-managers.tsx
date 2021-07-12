import { action } from '@storybook/addon-actions';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import AttachPasswordManagerItem from '../../app/password-managers/components/AttachPasswordManagerItem';
import Banner from '../../app/password-managers/components/Banner';
import Unlock from '../../app/password-managers/components/Unlock';
import { PasswordManager, Provider } from '../../app/password-managers/types';
import AppContainer from '../commons/AppContainer';

const providers: Provider[] = [
  {
    id: 'OnePassword',
    name: '1Password',
    idKey: 'idKey',
  },
];

const passwordManager: PasswordManager = {
  providerId: 'OnePassword',
  providerName: '1Password',
  id: 'idKey',
  email: 'test@getstation.com',
  domain: 'getstation.com',
  secretKey: 'secretKey',
};

const accounts = [
  {
    title: 'Trello',
    description: 'Perso',
    value: 'password',
  },
  {
    title: 'Trello',
    description: 'Pro',
    value: 'password2',
  },
  {
    title: 'Trello',
    description: 'Perso 2',
    value: 'password3',
  },
  {
    title: 'Trello',
    description: 'Pro 2',
    value: 'password4',
  },
  {
    title: 'Trello',
    description: 'Perso 3',
    value: 'password5',
  },
  {
    title: 'Trello',
    description: 'Pro 3',
    value: 'password6',
  },
  {
    title: 'Trello',
    description: 'Perso 4',
    value: 'password7',
  },
];

const passwordManagersStories = storiesOf('Components|Password Managers', module);
passwordManagersStories
  .addDecorator(withKnobs)
  .add('Banner', () => (
    <AppContainer>
      <Banner
        applicationName={text('Application Name', 'Trello')}
        applicationId={'trello'}
        passwordManager={passwordManager}
        provider={providers[0]}
        onAddPasswordManager={action('onAddPasswordManager')}
        onAttachPasswordManagerItem={action('onAttachPasswordManagerItem')}
      />
    </AppContainer>
  ))
  .add('Unlock', () => (
    <AppContainer>
      <Unlock
        passwordManager={passwordManager}
        onUnlock={action('onUnlock')}
        onCancel={action('onCancel')}
        providerName={providers[0].name}
        applicationName={text('Application Name', 'Trello')}
      />
    </AppContainer>
  ))
  .add('Attach Password Manager Item', () => (
    <AppContainer>
      <AttachPasswordManagerItem
        url={'https://www.trello.com'}
        applicationName={text('Application Name', 'Trello')}
        applicationIcon={'icon'}
        providerName={providers[0].name}
        accounts={accounts}
        onSelect={action('onSelect')}
        onLogin={action('onLogin')}
        onCancel={action('onCancel')}
      />
    </AppContainer>
  ))
  .add('Attach Password Manager Item with no results', () => (
    <AppContainer>
      <AttachPasswordManagerItem
        url={'https://www.trello.com'}
        applicationName={text('Application Name', 'Trello')}
        applicationIcon={'icon'}
        providerName={providers[0].name}
        accounts={[]}
        onSelect={action('onSelect')}
        onLogin={action('onLogin')}
        onCancel={action('onCancel')}
      />
    </AppContainer>
  ));
