import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Modal } from './index';

const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' +
  ' sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
  ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi' +
  ' ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit' +
  ' in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur' +
  ' sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt' +
  ' mollit anim id est laborum.';

storiesOf('Molecules|Modal', module)
  .addDecorator(withKnobs)
  .add('Modal', () => (
    <Modal
      title={text('Title', 'My modal')}
      description={text('Description', 'My awesome modal here')}
      onCancel={action('cancel')}
      onClickOutside={action('clicked outside')}
    >
      {text('Content', 'Content of the modal')}
    </Modal>
  ))
  .add('Modal with long description', () => (
    <Modal
      title={text('Title', 'My modal')}
      description={text(
        'Description',
        `My awesome modal here: this is a long long long long long long long description`,
      )}
      onCancel={action('cancel')}
      onClickOutside={action('clicked outside')}
    >
      {text('Content', `Content of the modal: ${loremIpsum}. ${loremIpsum}`)}
    </Modal>
  ))
  .add('Modal with buttons', () => (
    <Modal
      title={text('Title', 'My modal')}
      description={text('Description', 'My awesome modal here')}
      onCancel={action('cancel')}
      onContinue={action('continue')}
      continueDanger={boolean('continueDanger', false)}
      continueContent={text('continueContent', '')}
      onClickOutside={action('clicked outside')}
    >
      {text('Content', 'Content of the modal with action buttons')}
    </Modal>
  ))
  .add('Modal with buttons and App icon', () => (
    <Modal
      title={text('Title', 'My modal')}
      description={text('Description', 'My awesome modal here')}
      onCancel={action('cancel')}
      onContinue={action('continue')}
      onClickOutside={action('clicked outside')}
      applicationIcon={text(
        'applicationIcon',
        'https://dl.airtable.com/GFscY2CMS6WaaWzOrjlT_provider-svg-gmail.svg',
      )}
      themeColor={text('themeColor', '#ABCDEF')}
      continueDanger={boolean('continueDanger', false)}
      continueContent={text('continueContent', '')}
    >
      {text('Content', 'Content of the modal with buttons and Application icon')}
    </Modal>
  ))
  .add('Modal - loading state', () => (
    <Modal
      title={text('Title', 'My modal')}
      description={text('Description', 'My awesome modal here')}
      onCancel={action('cancel')}
      onContinue={action('continue')}
      onClickOutside={action('clicked outside')}
      applicationIcon={text(
        'applicationIcon',
        'https://dl.airtable.com/GFscY2CMS6WaaWzOrjlT_provider-svg-gmail.svg',
      )}
      themeColor={text('themeColor', '#ABCDEF')}
      isLoading={boolean('isLoading', true)}
      confirmButtonIsLoading={boolean('confirmButtonIsLoading', true)}
      continueDanger={boolean('continueDanger', false)}
      continueContent={text('continueContent', '')}
    >
      <div>
        {
          // tslint:disable-next-line: max-line-length
          text('Content', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris semper risus venenatis justo maximus ultricies. Donec eget mi imperdiet, eleifend nisi ut, cursus ex. Pellentesque est arcu, vestibulum ac feugiat quis, vulputate in massa. Donec malesuada tempus tortor, ut sodales magna vulputate quis. Nunc ac tortor iaculis, rhoncus urna rutrum, luctus libero. Donec nec scelerisque justo, quis pharetra ante. Donec porta lacus quis orci egestas, nec vulputate quam ultricies.')
        }
      </div>
      <br/>
      <div>
        {
          // tslint:disable-next-line: max-line-length
          text('Content', 'Proin at ex nisi. Aliquam faucibus eu erat nec sollicitudin. Aliquam non sapien vitae velit blandit sollicitudin at non mi. Morbi pellentesque, est vitae placerat semper, lorem elit ultricies mauris, sed porttitor augue augue quis ex. Maecenas id pellentesque ligula. Nullam porttitor ipsum dui, sit amet maximus libero fermentum non. Nulla vulputate nisi lectus, non scelerisque dolor consequat sed. Ut id mattis metus, sed mattis justo. Phasellus sollicitudin mi lacus, eu eleifend elit finibus sit amet. Ut id vestibulum nunc. Morbi ac pellentesque odio. Etiam ac quam sodales, pulvinar metus sit amet, vestibulum erat. Nam facilisis nisi eu laoreet laoreet. Aenean volutpat purus ante, et consequat velit aliquam a. Etiam molestie, diam eu sollicitudin tristique, nunc diam tincidunt urna, id iaculis est magna ac dolor. Aenean in enim vulputate, euismod ex in, sollicitudin quam.')
        }
      </div>
      <br/>
      <div>
        {
          // tslint:disable-next-line: max-line-length
          text('Content', 'Proin viverra libero risus, sed facilisis risus tincidunt at. Praesent ultrices, urna sed aliquet tempor, tortor mi scelerisque risus, at finibus erat quam at massa. Curabitur et dapibus purus. Etiam pellentesque dolor vitae pulvinar rutrum. Sed dignissim elit purus, id semper lacus pharetra nec. Proin sit amet massa ut massa euismod maximus. Morbi posuere sollicitudin elit, ut lobortis ipsum fermentum eget. Nam sagittis eros ut ex mattis, quis lobortis dui efficitur. Pellentesque feugiat magna cursus suscipit euismod.')
        }
      </div>
    </Modal>
  ));
