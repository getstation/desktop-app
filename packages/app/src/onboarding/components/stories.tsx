import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OnboardingDockIcon } from './OnboardingDockIcon';
import OnboardingStepAppStore from './OnboardingStepAppStore';

const mockApps = [
  {
    id: 'slack',
    name: 'Slack',
    bxAppManifestURL: 'https://example.com/slack',
    iconURL: 'https://cdn.getstation.com/logo/slack.png',
    themeColor: '#4A154B',
    isChromeExtension: false,
    recommendedPosition: 1,
  },
  {
    id: 'notion',
    name: 'Notion',
    bxAppManifestURL: 'https://example.com/notion',
    iconURL: 'https://cdn.getstation.com/logo/notion.png',
    themeColor: '#111111',
    isChromeExtension: false,
    recommendedPosition: 2,
  },
  {
    id: 'github',
    name: 'GitHub',
    bxAppManifestURL: 'https://example.com/github',
    iconURL: 'https://cdn.getstation.com/logo/github.png',
    themeColor: '#24292E',
    isChromeExtension: false,
    recommendedPosition: 3,
  },
];

const meta: Meta = {
  title: 'Screens/Onboarding',
};

export default meta;

type Story = StoryObj;

export const DockIcon: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <OnboardingDockIcon application={mockApps[0]} indexPosition={0} />
    </div>
  ),
};

export const StepAppStore: Story = {
  render: () => (
    <div style={{ width: 720, margin: '0 auto', padding: 24 }}>
      <OnboardingStepAppStore
        applications={mockApps}
        selectedApplications={[mockApps[0], mockApps[1], mockApps[2]]}
        onHandleApplicationSelect={() => undefined}
        onValidSubmit={() => undefined}
        searchInputValue=""
        handleSearchInputValue={() => undefined}
        isLoading={false}
      />
    </div>
  ),
};
