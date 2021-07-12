import * as React from 'react';
import { addDecorator, configure } from '@storybook/react';
import {
  BrowserXThemeProvider,
  COLORS,
  getGradientCSSBackground,
  GradientProvider,
  Theme
} from '@getstation/theme';
import '../app/theme/css/app.global.css';
import { setOptions } from '@storybook/addon-options';
import backgrounds from '@storybook/addon-backgrounds';
import { action } from '@storybook/addon-actions';
import apolloStorybookDecorator from 'apollo-storybook-react';
import { ApolloLink } from 'apollo-link';
import { print } from 'graphql';
import { getMainDefinition } from 'apollo-utilities';
import typeDefs from '../app/graphql/schema.graphql';
import mocks from './mocks';
import { withNotes } from '@storybook/addon-notes';
import { withInfo } from '@storybook/addon-info';

setOptions({
  name: 'Station Styleguide v' + require('../package.json').version,
  hierarchySeparator: /\//,
  hierarchyRootSeparator: /\|/
});

const req = require.context('../app', true, /stories.tsx$/);
function loadStories() {
  require('../stories/home');
  require('../stories/theme/icons');
  require('../stories/components/subdock-application');
  require('../stories/components/dialog-item');
  require('../stories/components/quick-switch');
  require('../stories/screens/onboarding');
  require('../stories/screens/dock');
  require('../stories/screens/multi-account-configurator');
  /*
    Broken stories (Node dependencies)

    require('../stories/theme/settings');
    require('../stories/components/password-managers');
  */

  req.keys().forEach(filename => req(filename));
}

addDecorator(
  backgrounds([
    { name: 'Transparent', value: 'transparent' },
    {
      name: 'Dawn',
      value: getGradientCSSBackground(COLORS.get(Theme.dawn).colors)
    },
    {
      name: 'Sunrise',
      value: getGradientCSSBackground(COLORS.get(Theme.sunrise).colors),
      default: true
    },
    {
      name: 'Morning',
      value: getGradientCSSBackground(COLORS.get(Theme.morning).colors)
    },
    {
      name: 'Midday',
      value: getGradientCSSBackground(COLORS.get(Theme.midday).colors)
    },
    {
      name: 'Afternoon',
      value: getGradientCSSBackground(COLORS.get(Theme.afternoon).colors)
    },
    {
      name: 'Sunset',
      value: getGradientCSSBackground(COLORS.get(Theme.sunset).colors)
    },
    {
      name: 'Night',
      value: getGradientCSSBackground(COLORS.get(Theme.night).colors)
    },
    {
      name: 'Gmail',
      value: 'top / 100% no-repeat url("/static/storybook/interface-gmail.png")'
    },
    {
      name: 'Calendar',
      value:
        'top / 100% no-repeat url("/static/storybook/interface-calendar.png")'
    },
    {
      name: 'GDrive',
      value:
        'top / 100% no-repeat url("/static/storybook/interface-gdrive.png")'
    },
    {
      name: 'Slack',
      value: 'top / 100% no-repeat url("/static/storybook/interface-slack.png")'
    },
    {
      name: 'Notion',
      value:
        'top / 100% no-repeat url("/static/storybook/interface-notion.png")'
    }
  ])
);

// looks like the local schema executor does not like the presence of
// directives on the query: let's remove them
const removeDirectivesLink = new ApolloLink((operation, forward) => {
  delete operation.query.definitions[0].directives;
  return forward(operation);
});

// logs mutations as Storybook actions
const logMutationsAsStorybookActions = new ApolloLink((operation, forward) => {
  const mainDef = getMainDefinition(operation.query);
  if (
    mainDef.kind === 'OperationDefinition' &&
    mainDef.operation === 'mutation'
  ) {
    action('graphql')(operation.operationName, operation.variables, {
      query: print(operation.query)
    });
  }
  return forward(operation);
});

addDecorator(
  apolloStorybookDecorator({
    typeDefs,
    mocks,
    links: () => {
      return [logMutationsAsStorybookActions, removeDirectivesLink];
    }
  })
);

addDecorator(story => (
  <BrowserXThemeProvider>
    <GradientProvider themeColors={COLORS.get(Theme.dawn).colors}>
      {story()}
    </GradientProvider>
  </BrowserXThemeProvider>
));

addDecorator(withNotes);
addDecorator(withInfo);

configure(loadStories, module);
