import type { Meta, StoryObj } from '@storybook/react';
import * as applications from '@src/components/common/ApplicationList/applications.sample.json';

import { ApplicationsList } from './ApplicationsList';

const meta: Meta<typeof ApplicationsList> = {
  title: 'Common/ApplicationList',
  component: ApplicationsList,
  args: {
    applications,
    iconSize: 30,
    marginBetweenApps: 7,
    isDockPreview: false,
    direction: 'column',
  },
};

export default meta;

type Story = StoryObj<typeof ApplicationsList>;

export const DefaultColumn: Story = {};

export const DockPreview: Story = {
  args: {
    isDockPreview: true,
  },
};

export const Row: Story = {
  args: {
    direction: 'row',
    marginBetweenApps: 11,
  },
};
