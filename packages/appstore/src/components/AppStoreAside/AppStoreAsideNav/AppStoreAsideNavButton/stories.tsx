import type { Meta, StoryObj } from '@storybook/react';
import AppStoreAsideNavButton from './AppStoreAsideNavButton';

const meta: Meta<typeof AppStoreAsideNavButton> = {
  title: 'Components/AppStoreAsideNavButton',
  component: AppStoreAsideNavButton,
  args: {
    onClick: () => undefined,
    isActive: true,
    isBurgerOpen: false,
    iconName: '#i--hot',
    title: 'Most Popular',
    screenName: 'MOST_POPULAR',
  },
};

export default meta;

type Story = StoryObj<typeof AppStoreAsideNavButton>;

export const Default: Story = {};
