import type { Meta, StoryObj } from '@storybook/react';
import AppStoreSearch from './AppStoreSearch';

const applications = Array.from({ length: 5 }, (_, i) => ({
  id: String(i),
  name: 'Google Drive',
  categoryName: 'File Provider',
  iconURL: 'https://cdn.filestackcontent.com/J4MAUo7LRZm2fhyp6X0f',
  themeColor: '#FCCD48',
  isExtension: false,
  shouldDisplayCategory: false,
}));

const meta: Meta<typeof AppStoreSearch> = {
  title: 'Common/Search/AppStoreSearch',
  component: AppStoreSearch,
  args: {
    applications,
    onQueryChange: () => undefined,
    onSelectApplication: () => undefined,
  },
};

export default meta;

type Story = StoryObj<typeof AppStoreSearch>;

export const Default: Story = {};
