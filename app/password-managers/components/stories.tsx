import * as React from 'react';
import centered from '@storybook/addon-centered';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

// import { PasswordManager } from '../types';
// import { LOAD_ACCOUNTS, AccountsAction } from '../duck';

import LoadCredentials from './LoadCredentials';
// import Unlock from './Unlock';
// import AttachPasswordManagerItem from './AttachPasswordManagerItem';

// MOCKS

// const passwordManager: PasswordManager = {
//   providerId: 'OnePassword',
//   providerName: '1Password',
//   id: 'idKey',
//   email: 'test@getstation.com',
//   domain: 'getstation.com',
//   secretKey: 'secretKey',
// };

// const processUnlock = {
//   type: LOAD_ACCOUNTS,
//   step: 2,
// };

// const processAttach = {
//   type: LOAD_ACCOUNTS,
//   step: 2,
// } as AccountsAction;

// ACTIONS

const noop = () => undefined;

// STORY

const story = storiesOf('Modals|Password Manager', module);

// Load Credentials
story
  .addDecorator(withKnobs)
  .addDecorator(centered)
  .add(
    'Load Credentials',
    () => (
      <>
        <LoadCredentials
          applicationName={'Random App'}
          applicationIcon={'nothing'}
          themeColor={'#114488'}
          providerName={'TestAuth'}
        />
      </>
    ),
  );

// Unlock
// story
//   .add(
//     'Unlock',
//     () => (
//       <>
//         <Unlock
//           process={processUnlock}
//           passwordManager={passwordManager}
//           onUnlock={noop}
//           onCancel={noop}
//           providerName={'TestAuth'}
//           applicationName={'App Z'}
//         />
//       </>
//     ),
//   );

// Attach Password Manager Item
// story
//   .add(
//     'Attach Item',
//     () => (
//       <>
//         <AttachPasswordManagerItem
//           process={processAttach}
//           passwordManager={passwordManager}
//           applicationManifestURL={'https://test.random'}
//           applicationName={'Random App'}
//           applicationIcon={'nothing'}
//           themeColor={'#114488'}
//           onSelect={noop}
//           onCancel={noop}
//         />
//       </>
//     ),
//   );
