import type { Meta, StoryObj } from '@storybook/react';
import AppRequestError from './AppRequestError';

const meta: Meta<typeof AppRequestError> = {
  title: 'Components/AppRequestError',
  component: AppRequestError,
};

export default meta;

type Story = StoryObj<typeof AppRequestError>;

export const Default: Story = {};
