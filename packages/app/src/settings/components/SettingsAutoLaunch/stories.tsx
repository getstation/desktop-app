import type { Meta, StoryObj } from '@storybook/react';
import SettingsAutoLaunch from './SettingsAutoLaunch';

const meta: Meta<typeof SettingsAutoLaunch> = {
  title: 'Screens/Settings/SettingsAutoLaunch',
  component: SettingsAutoLaunch,
};

export default meta;

type Story = StoryObj<typeof SettingsAutoLaunch>;

export const Default: Story = {};
