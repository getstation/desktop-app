import { RecursiveImmutableMap } from '../types';

export enum OnboardingType {
  Undefined = 0,
  Regular,
  Onboardee,
}

export type RegularOrOnboardee = OnboardingType.Regular | OnboardingType.Onboardee;

export const isRegularOrOnboardee = (onboardingType: OnboardingType): onboardingType is RegularOrOnboardee => {
  return onboardingType !== OnboardingType.Undefined;
};

export type StationUi = {
  applicationTabAdded?: Record<string, boolean>,
  cursorIcon?: string,
  settings?: {
    activeTabTitle?: string,
    isVisible?: boolean,
    selectedManifestURL?: string,
  },
  qs?: {
    highlightedItemId?: string,
  },
  recentSubdock?: {
    highlightedItemId?: string,
    isVisible?: boolean,
  },
  onboarding?: {
    step?: number,
    onboardingSessionId?: string,
    onboardingType?: OnboardingType,
  },
  confirmResetApplicationModal?: {
    isVisible?: number | false,
  },
};

export type StationUiImmutable = RecursiveImmutableMap<StationUi>;
