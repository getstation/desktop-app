import { action } from '@storybook/addon-actions';
import { boolean, number, text, withKnobs, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import BangBottom from '../../app/bang/components/BangBottom';
import BangInsert from '../../app/bang/components/BangInsert';
import BangItem from '../../app/bang/components/BangItem';
import BangPresenter from '../../app/bang/components/BangPresenter';
import ModalWrapper from '../../app/common/containers/ModalWrapper';

const containerStyle = {
  width: 450,
  backgroundColor: 'gray',
};

const gDriveIconSrc = 'http://icons.iconarchive.com/icons/marcus-roberto/google-play/256/Google-Drive-icon.png';
const searchItemContext = 'This channel is for workspace-wide communication and announcements. All members are in this channel.';
// tslint:disable-next-line
const items = [{"results":[{"_frecencyScore":0,"imgUrl":"https://a.slack-edge.com/436da/marketing/img/meta/ios-144.png","context":"Slack > Station","serviceId":"slack","label":"general","sectionKind":"top-hits","id":"C90J73KQB","onSelect":true,"uniqId":"bang/EMPTY_SECTION-C90J73KQB","category":"Slack: Station"},{"_frecencyScore":0,"imgUrl":"https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document","url":"https://docs.google.com/document/d/1UKd6Nu_DA0fdr0YwfLQOf542T65criXtenNEVIwopnU/edit?usp=drivesdk","context":"testapp@getstation.com","serviceId":"gdrive-mu","label":"General Moutarde","sectionKind":"top-hits","id":"1UKd6Nu_DA0fdr0YwfLQOf542T65criXtenNEVIwopnU","onSelect":false,"uniqId":"bang/EMPTY_SECTION-1UKd6Nu_DA0fdr0YwfLQOf542T65criXtenNEVIwopnU","category":"Google Drive - testapp@getstation.com"},{"additionalSearchString":"Georges Georges Abi-Heila Georges Abi-Heila","meta":{"first_name":"Georges"},"_frecencyScore":0,"imgUrl":"https://avatars.slack-edge.com/2018-08-03/410308981139_f275174d7c74e298a644_48.jpg","context":"Slack > Station","serviceId":"slack","label":"Georges Abi-Heila","sectionKind":"top-hits","id":"U90SV9KCM","onSelect":true,"uniqId":"bang/EMPTY_SECTION-U90SV9KCM","category":"Slack: Station"}],"sectionKind":"top-hits","sectionName":"bang/EMPTY_SECTION"},{"loading":false,"results":[{"additionalSearchString":"Slack - stationworld.slack.com general | Station Slack","_frecencyScore":0,"applicationId":"slack-HS_pUspJo","imgUrl":"/Users/station-mathieu/Workspace/Station/browserX/node_modules/@getstation/services/static/icon--provider/icon-provider--slack.svg","url":"https://stationworld.slack.com/messages/C90J73KQB/","context":"stationworld.slack.com","serviceId":"slack","label":"Slack","sectionKind":"apps","type":"station-app","id":"slack-HS_pUspJo/Qz_8I2N1LU","onSelect":false,"uniqId":"Apps-slack-HS_pUspJo/Qz_8I2N1LU","category":"Apps"}],"sectionKind":"apps","sectionName":"Apps"},{"loading":false,"results":[{"_frecencyScore":0,"imgUrl":"https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document","url":"https://docs.google.com/document/d/1UKd6Nu_DA0fdr0YwfLQOf542T65criXtenNEVIwopnU/edit?usp=drivesdk","context":"testapp@getstation.com","serviceId":"gdrive-mu","label":"General Moutarde","sectionKind":"app-specific","id":"1UKd6Nu_DA0fdr0YwfLQOf542T65criXtenNEVIwopnU","onSelect":false,"uniqId":"Google Drive - testapp@getstation.com-1UKd6Nu_DA0fdr0YwfLQOf542T65criXtenNEVIwopnU","category":"Google Drive - testapp@getstation.com"}],"sectionKind":"app-specific","sectionName":"Google Drive - testapp@getstation.com"},{"loading":false,"results":[{"_frecencyScore":0,"imgUrl":"https://a.slack-edge.com/436da/marketing/img/meta/ios-144.png","context":"Slack > Station","serviceId":"slack","label":"general","sectionKind":"app-specific","id":"C90J73KQB","onSelect":true,"uniqId":"Slack: Station-C90J73KQB","category":"Slack: Station"},{"additionalSearchString":"Georges Georges Abi-Heila Georges Abi-Heila","meta":{"first_name":"Georges"},"_frecencyScore":0,"imgUrl":"https://avatars.slack-edge.com/2018-08-03/410308981139_f275174d7c74e298a644_48.jpg","context":"Slack > Station","serviceId":"slack","label":"Georges Abi-Heila","sectionKind":"app-specific","id":"U90SV9KCM","onSelect":true,"uniqId":"Slack: Station-U90SV9KCM","category":"Slack: Station"},{"additionalSearchString":"Julien Julien Berthomier Julien Berthomier","meta":{"first_name":"Julien"},"_frecencyScore":0,"imgUrl":"https://avatars.slack-edge.com/2018-08-01/410021645879_3ece6d1060d905d08267_48.png","context":"Slack > Station","serviceId":"slack","label":"Julien Berthomier","sectionKind":"app-specific","id":"U9020DVRN","onSelect":true,"uniqId":"Slack: Station-U9020DVRN","category":"Slack: Station"},{"_frecencyScore":0,"imgUrl":"https://a.slack-edge.com/436da/marketing/img/meta/ios-144.png","context":"Slack > Station","serviceId":"slack","label":"yc-retention","sectionKind":"app-specific","id":"C9051DNUR","onSelect":true,"uniqId":"Slack: Station-C9051DNUR","category":"Slack: Station"},{"additionalSearchString":["",""],"_frecencyScore":0,"imgUrl":"https://a.slack-edge.com/436da/marketing/img/meta/ios-144.png","context":"Slack > Station","serviceId":"slack","label":"Georges and Julien","sectionKind":"app-specific","id":"G9355ULE7","onSelect":true,"uniqId":"Slack: Station-G9355ULE7","category":"Slack: Station"},{"additionalSearchString":["","","",""],"_frecencyScore":0,"imgUrl":"https://a.slack-edge.com/436da/marketing/img/meta/ios-144.png","context":"Slack > Station","serviceId":"slack","label":"Julien, (2 more...) and Georges","sectionKind":"app-specific","id":"GA58UMHHV","onSelect":true,"uniqId":"Slack: Station-GA58UMHHV","category":"Slack: Station"},{"additionalSearchString":["",""],"_frecencyScore":0,"imgUrl":"https://a.slack-edge.com/436da/marketing/img/meta/ios-144.png","context":"Slack > Station","serviceId":"slack","label":"Georges and Hugo","sectionKind":"app-specific","id":"GAQNU6NFJ","onSelect":true,"uniqId":"Slack: Station-GAQNU6NFJ","category":"Slack: Station"},{"additionalSearchString":["",""],"_frecencyScore":0,"imgUrl":"https://a.slack-edge.com/436da/marketing/img/meta/ios-144.png","context":"Slack > Station","serviceId":"slack","label":"Julien and Joël","sectionKind":"app-specific","id":"G933U33NY","onSelect":true,"uniqId":"Slack: Station-G933U33NY","category":"Slack: Station"},{"additionalSearchString":["","","","",""],"_frecencyScore":0,"imgUrl":"https://a.slack-edge.com/436da/marketing/img/meta/ios-144.png","context":"Slack > Station","serviceId":"slack","label":"Julien, (3 more...) and Alexandre","sectionKind":"app-specific","id":"GCBMPDMHT","onSelect":true,"uniqId":"Slack: Station-GCBMPDMHT","category":"Slack: Station"},{"additionalSearchString":["","","",""],"_frecencyScore":0,"imgUrl":"https://a.slack-edge.com/436da/marketing/img/meta/ios-144.png","context":"Slack > Station","serviceId":"slack","label":"Julien, (2 more...) and Alexandre","sectionKind":"app-specific","id":"GA3LCMQHF","onSelect":true,"uniqId":"Slack: Station-GA3LCMQHF","category":"Slack: Station"}],"sectionKind":"app-specific","sectionName":"Slack: Station"}];

const SearchPaneItemSelectedItemTypes = [
  'favorite',
  'tab',
  'station-app',
  'integration-result',
];

storiesOf('Components|Quick-Switch', module)
  .addDecorator(withKnobs)
  .add(
    'Quick-Switch',
    () => (
      <ModalWrapper backgroundOverlay={false}>
        <BangPresenter
          searchValue={text('searchValue', 'gen')}
          items={items}
          itemsForEmptyQuery={items}
          isVisible={boolean('isVisible', true)}
          shouldShowInsert={boolean('shouldShowInsert', true)}
          focus={number('focus', 0)}
          activeApplicationId={text('activeApplicationId', 'ché ap')}
          isGDriveConnected={boolean('isGDriveConnected', false)}
          onSearchValueChange={action('onSearchValueChange')}
          onSelectItem={action('onSelectItem')}
          onShowSettings={action('onShowSettings')}
          onQuit={action('onQuit')}
          highlightedItemId={text('highlightedItemId', '0')}
          gDriveIcon={text('gDriveIconSrc', gDriveIconSrc)}
          kbShortcut={text('kbShortcut', 'CTRL+T')}
          setRef={action('setRef')}
          handleArrowDown={action('handleArrowDown')}
          handleArrowUp={action('handleArrowUp')}
          handleEnter={action('handleEnter')}
          handleClick={action('handleClick')}
          searchShortcut={text('searchShortcut', '@')}
        />
      </ModalWrapper>
    ))
  .add(
    'Quick-Switch item',
    () => (
      <div style={containerStyle}>
        <BangItem
          key={'key'}
          label={text('label', 'Slite')}
          context={text('context', searchItemContext)}
          imgUrl={text('imgUrl', 'https://pbs.twimg.com/profile_images/959451316903845889/BpKfHFc4_400x400.jpg')}
          selected={boolean('selected', false)}
          onClick={action('onClick')}
          // @ts-ignore
          type={select('type', SearchPaneItemSelectedItemTypes, 'station-app')}
        />
      </div>
    ))
  .add(
    'Quick-Switch Insert',
    () => (
      <div style={containerStyle}>
        <BangInsert
          gDriveIconSrc={text('gDriveIconSrc', gDriveIconSrc)}
          isGDriveConnected={boolean('isGDriveConnected', false)}
          onGDriveConnect={action('onGDriveConnect')}
        />
      </div>
    ))
  .add(
    'Quick-Switch Bottom',
    () => (
      <div style={containerStyle}>
        <BangBottom
          onClickSettings={action('onClickSettings')}
          searchShortcut={text('searchShortcut', '@')}
          ctrlTabCycling={boolean('ctrlTabCycling', false)}
        />
      </div>
    ));
