import type { Meta, StoryObj } from '@storybook/react';
import { AppDockIcon, AppearingAppDockIcon } from './AppDockIcon';

const appDockIconMeta: Meta<typeof AppDockIcon> = {
  title: 'Molecules/Dock/AppDockIcon',
  component: AppDockIcon,
  args: {
    active: false,
    applicationId: 'applicationId',
    logoURL: 'https://i.pravatar.cc/150',
    iconURL: 'https://cdn.filestackcontent.com/J4MAUo7LRZm2fhyp6X0f',
    themeColor: '#FCCD48',
    snoozed: false,
    badge: '•',
    loading: false,
  },
};

export default appDockIconMeta;

type Story = StoryObj<typeof AppDockIcon>;

export const AppDockIconStory: Story = {};

export const AppearingAppDockIconStory: StoryObj<typeof AppearingAppDockIcon> = {
  render: () => (
    <AppearingAppDockIcon
      active={false}
      applicationId="applicationId"
      iconURL="https://cdn.filestackcontent.com/J4MAUo7LRZm2fhyp6X0f"
      themeColor="#FCCD48"
      loading={false}
      dramaticEnter={false}
    />
  ),
};
