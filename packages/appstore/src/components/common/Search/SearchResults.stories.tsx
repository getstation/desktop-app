import type { Meta, StoryObj } from '@storybook/react';
import SearchResults from './SearchResults';

const applications = Array.from({ length: 30 }, (_, i) => ({
  id: String(i),
  name: 'Google Drive',
  categoryName: 'File Provider',
  iconURL: 'https://cdn.filestackcontent.com/J4MAUo7LRZm2fhyp6X0f',
  themeColor: '#FCCD48',
  isExtension: false,
  shouldDisplayCategory: false,
}));

const meta: Meta<typeof SearchResults> = {
  title: 'Common/Search/SearchResults',
  component: SearchResults,
  args: {
    applications,
  },
};

export default meta;

type Story = StoryObj<typeof SearchResults>;

export const Default: Story = {};
