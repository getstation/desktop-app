import * as Immutable from 'immutable';
import { ListStateProxy } from '../../../app/persistence/backend';
import { UserWeeklyUsageProxy } from '../../../app/persistence/local.backend';
import umzug from '../../../app/persistence/umzug';

const weeklyUsageData = Immutable.List([
  1513589415, // 12/18/2017 @ 9:30am (UTC)
  1513686855, // 12/19/2017 @ 12:34pm (UTC)
  1513791796, // 12/20/2017 @ 5:43pm (UTC)
]);

beforeAll(() => umzug.up());

const proxy = new ListStateProxy(UserWeeklyUsageProxy);

test('db has no User Weekly Usage data', () => proxy.get()
  .then(weeklyusage => {
    expect(weeklyusage.size === 0).toBe(true);
  }));

test('User Weekly Usage as 3 dates', () => proxy.set(weeklyUsageData)
  .then(() => proxy.get())
  .then(weeklyusage => {
    expect(weeklyusage.toJS()).toEqual(weeklyUsageData.toJS());
  }));

test('empty memory cache and load from db', () => {
  proxy.clear();
  return proxy.get()
    .then(weeklyusage => {
      expect(weeklyUsageData.toJS()).toEqual(weeklyusage.toJS());
    });
});
