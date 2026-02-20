import type { Meta, StoryObj } from '@storybook/react';
import DownloadToast from './components/DownloadToast';

const meta: Meta<typeof DownloadToast> = {
  title: 'Components/Download Toast',
  component: DownloadToast,
  args: {
    applicationId: 'slack',
    failed: false,
    filename: 'A very long filename',
    completionPercent: 50,
    onClickOpen: () => undefined,
    onClickHide: () => undefined,
    themeColor: '#EEEEEE',
  },
};

export default meta;

type Story = StoryObj<typeof DownloadToast>;

export const Default: Story = {};
