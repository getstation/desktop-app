import type { Meta, StoryObj } from '@storybook/react';
import LoadCredentials from './LoadCredentials';

const meta: Meta<typeof LoadCredentials> = {
  title: 'Modals/Password Manager/LoadCredentials',
  component: LoadCredentials,
  args: {
    applicationName: 'Random App',
    applicationIcon: 'nothing',
    themeColor: '#114488',
    providerName: 'TestAuth',
  },
};

export default meta;

type Story = StoryObj<typeof LoadCredentials>;

export const Default: Story = {};
