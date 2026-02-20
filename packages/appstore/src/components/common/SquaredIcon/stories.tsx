import type { Meta, StoryObj } from '@storybook/react';
import { IconSymbol } from '@getstation/theme';
import SquaredIcon from '@src/components/common/SquaredIcon/SquaredIcon';

const meta: Meta<typeof SquaredIcon> = {
  title: 'Common/SquaredIcon',
  component: SquaredIcon,
  args: {
    icon: IconSymbol.SEND,
    tooltip: 'this is tooltip',
    onClick: () => undefined,
  },
};

export default meta;

type Story = StoryObj<typeof SquaredIcon>;

export const Default: Story = {};
