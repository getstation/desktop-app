import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { from } from 'rxjs';
import MultiInstanceConfigurator from '../../app/applications/multi-instance-configuration/webui/MultiInstanceConfigurator';

const windowBxOverrideForOnPremiseApp = () => {
  (window as any).bx = {
    applications: {
      setConfigData: action('submit'),
    },
    manifest: {
      async getManifest() {
        return JSON.parse('{"name":"Slack","start_url":"https://{{subdomain}}.slack.com","icons":[{"src":"https://cdn.filestackcontent.com/dWQT0dr1R9KvXSOsSH6h","platform":"browserx"}],"theme_color":"#42C299","scope":"https://*.slack.com","bx_keep_always_loaded":true,"bx_single_page":true,"bx_legacy_service_id":"slack","bx_multi_instance_config":{"presets":["on-premise"],"instance_wording":"team","instance_label_tpl":"{{subdomain}}.slack.com","start_url_tpl":"https://{{subdomain}}.slack.com","subdomain_title":"Slack domain","subdomain_ui_help":"Enter your team\'s Slack domain.","subdomain_ui_suffix":".slack.com"}}');
      },
    },
  };
};

const windowBxOverrideForSlack = () => {
  (window as any).bx = {
    applications: {
      setConfigData: action('submit'),
    },
    manifest: {
      async getManifest() {
        return JSON.parse('{"name":"Slack","start_url":"https://{{subdomain}}.slack.com","icons":[{"src":"https://cdn.filestackcontent.com/dWQT0dr1R9KvXSOsSH6h","platform":"browserx"}],"theme_color":"#42C299","scope":"https://*.slack.com","bx_keep_always_loaded":true,"bx_single_page":true,"bx_legacy_service_id":"slack","bx_multi_instance_config":{"presets":["subdomain"],"instance_wording":"team","instance_label_tpl":"{{subdomain}}.slack.com","start_url_tpl":"https://{{subdomain}}.slack.com","subdomain_title":"Slack domain","subdomain_ui_help":"Enter your team\'s Slack domain.","subdomain_ui_suffix":".slack.com"}}');
      },
    },
  };
};

const windowBxOverrideForGDrive = () => {
  (window as any).bx = {
    applications: {
      setConfigData: action('submit'),
    },
    manifest: {
      async getManifest() {
        return JSON.parse('{"name":"Google Drive","start_url":"https://drive.google.com/drive/{{#if moreThanOneIdentity}}u/{{userIdentity.profileData.email}}{{/if}}","icons":[{"src":"https://cdn.filestackcontent.com/J4MAUo7LRZm2fhyp6X0f","platform":"browserx"}],"theme_color":"#FCCD48","scope":"https://drive.google.com","extended_scopes":["https://docs.google.com","https://drive.google.com"],"bx_legacy_service_id":"gdrive-mu","bx_multi_instance_config":{"presets":["google-account"],"instance_wording":"account","instance_label_tpl":"{{email}}","start_url_tpl":"https://drive.google.com/drive/{{#if moreThanOneIdentity}}u/{{userIdentity.profileData.email}}{{/if}}"}}');
      },
    },
    identities: {
      $get: from([
        [{
          type: 'google',
          id: 'id',
          email: 'zevia@getstation.com',
          imageURL: 'https://momsmeet.com/wp-content/uploads/2016/06/MA-ZEVI-17.06_logo-300x300-wpcf_280x280.jpg',
        }],
      ]),
      requestLogin: action('requestLogin'),
    },
  };
};

storiesOf('Screens|Configuration pages', module)
  .addDecorator(withKnobs)
  .add('Subdomain Multi Account', () => {
    windowBxOverrideForSlack();
    return (
      <MultiInstanceConfigurator
        applicationId={'slack'}
        manifestURL={''}
        clickAccount={action('clicked')}
        onRemoveApplication={action('removed')}
      />
    );
  })
  .add('Google Multi Account', () => {
    windowBxOverrideForGDrive();
    return (
      <MultiInstanceConfigurator
        applicationId={'gdrive'}
        manifestURL={''}
        clickAccount={action('clicked')}
        onRemoveApplication={action('removed')}
      />
    );
  })
  .add('On-Premise <app></app>', () => {
    windowBxOverrideForOnPremiseApp();
    return (
      <MultiInstanceConfigurator
        applicationId={'gdrive'}
        manifestURL={''}
        clickAccount={action('clicked')}
        onRemoveApplication={action('removed')}
      />
    );
  });
