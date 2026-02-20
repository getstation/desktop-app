import type { Meta, StoryObj } from '@storybook/react';

import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Common/Textarea',
  component: Textarea,
  args: {
    placeholder: 'A simple placeholder',
    canEdit: true,
    text: '',
    onChange: () => undefined,
  },
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Empty: Story = {};

export const WithText: Story = {
  args: {
    text: 'this is a text, see the diff with placeholder ?',
  },
};

export const Disabled: Story = {
  args: {
    canEdit: false,
    text: 'this is a text, see the diff with placeholder ?',
  },
};
