import type { Meta, StoryObj } from '@storybook/react';
import Application from '@src/components/common/Application/Application';

const meta: Meta<typeof Application> = {
  title: 'Common/Application',
  component: Application,
  args: {
    id: '123',
    name: 'Google Drive',
    categoryName: 'File Provider',
    iconURL: 'https://cdn.filestackcontent.com/J4MAUo7LRZm2fhyp6X0f',
    themeColor: '#FCCD48',
    isExtension: false,
    shouldDisplayCategory: false,
    onSelect: () => undefined,
  },
};

export default meta;

type Story = StoryObj<typeof Application>;

export const Default: Story = {};
