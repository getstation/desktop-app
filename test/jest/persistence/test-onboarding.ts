import * as Immutable from 'immutable';
import { SingletonStateProxy } from '../../../app/persistence/backend';
import { OnboardingProxy } from '../../../app/persistence/local.backend';
import umzug from '../../../app/persistence/umzug';

const onboardingData = Immutable.Map({
  done: false
});

const onboardingData2 = Immutable.Map({
  done: true,
});

const onboardingData3 = Immutable.Map({
  done: true,
  appStoreTooltipDisabled: true,
});

const onboardingData4 = Immutable.Map({
  done: true,
  appStoreTooltipDisabled: true,
  sleepNotification: (new Date(2017, 1, 1, 10, 29, 12)).getTime(),
});

const onboardingData5 = Immutable.Map({
  done: true,
  appStoreTooltipDisabled: true,
  sleepNotification: (new Date(2017, 1, 1, 10, 29, 12)).getTime(),
  lastInvitationColleagueDate: (new Date(2018, 1, 30, 9, 30, 0)).getTime(),
});

beforeAll(() => umzug.up());

const proxy = new SingletonStateProxy(OnboardingProxy);

test('db has no onboarding data', () => proxy.get()
  .then(onboarding => {
    expect(onboarding.size === 0).toBe(true);
  }));

test('onboarding state 1', () => proxy.set(onboardingData)
  .then(() => proxy.get())
  .then(onboarding => {
    expect(onboardingData.toJS()).toEqual(onboarding.toJS());
  }));

test('onboarding state 2', () => proxy.set(onboardingData2)
  .then(() => proxy.get())
  .then(onboarding => {
    expect(onboardingData2.toJS()).toEqual(onboarding.toJS());
  }));

test('onboarding state 3', () => proxy.set(onboardingData3)
  .then(() => proxy.get())
  .then(onboarding => {
    expect(onboardingData3.toJS()).toEqual(onboarding.toJS());
  }));

test('onboarding state 4', () => proxy.set(onboardingData4)
  .then(() => proxy.get())
  .then(onboarding => {
    expect(onboardingData4.toJS()).toEqual(onboarding.toJS());
  }));

test('onboarding state 5', () => proxy.set(onboardingData5)
  .then(() => proxy.get())
  .then(onboarding => {
    expect(onboardingData5.toJS()).toEqual(onboarding.toJS());
  }));

test('empty memory cache and load from db', () => {
  proxy.clear();
  return proxy.get()
    .then(onboarding => {
      expect(onboardingData5.toJS()).toEqual(onboarding.toJS());
    });
});
