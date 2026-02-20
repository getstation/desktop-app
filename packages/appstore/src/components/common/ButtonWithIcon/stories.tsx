import type { Meta, StoryObj } from '@storybook/react';
import { IconSymbol } from '@getstation/theme';
import { ButtonWithIcon } from '@src/components/common/ButtonWithIcon/ButtonWithIcon';

const meta: Meta<typeof ButtonWithIcon> = {
  title: 'Common/ButtonWithIcon',
  component: ButtonWithIcon,
  args: {
    icon: IconSymbol.PLUS,
    label: 'Onboard a new employee',
    onClick: () => undefined,
  },
};

export default meta;

type Story = StoryObj<typeof ButtonWithIcon>;

export const Default: Story = {};
