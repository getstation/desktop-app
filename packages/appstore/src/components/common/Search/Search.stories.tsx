import type { Meta, StoryObj } from '@storybook/react';
import Search from './Search';

const meta: Meta<typeof Search> = {
  title: 'Common/Search/Search',
  component: Search,
  args: {
    query: 'notion',
    onQueryChange: () => undefined,
  },
};

export default meta;

type Story = StoryObj<typeof Search>;

export const Default: Story = {};
