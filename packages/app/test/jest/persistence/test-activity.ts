import * as Immutable from 'immutable';
import Activity from '../../../src/activity/model';
import { ListStateProxy } from '../../../src/persistence/backend';
import { ListProxyMixin } from '../../../src/persistence/mixins';
import umzug from '../../../src/persistence/umzug';

export class ActivityFakeProxy extends ListProxyMixin({
  model: Activity,
  mapStateToArray: async state => state.toJS(),
  mapArrayToState: async (obj) => {
    return Immutable.List(obj.map((x: any) => x.dataValues));
  },
}) {}

const activityData = Immutable.List([
  { pluginId: 'p1', manifestURL: 'p1', resourceId: 'r1', type: 'a', createdAt: new Date(4000), updatedAt: new Date(4000) },
  { pluginId: 'p1', manifestURL: 'p1', resourceId: 'r1', type: 'a', createdAt: new Date(3000), updatedAt: new Date(3000) },
  { pluginId: 'p1', manifestURL: 'p1', resourceId: 'r1', type: 'a', createdAt: new Date(2000), updatedAt: new Date(2000) },
  { pluginId: 'p1', manifestURL: 'p1', resourceId: 'r1', type: 'a', createdAt: new Date(1000), updatedAt: new Date(1000), extraData: '{}' },
]);

const expectedActivityData = Immutable.List([
  { id: 1, pluginId: 'p1', manifestURL: 'p1', resourceId: 'r1', type: 'a', createdAt: new Date(4000), updatedAt: new Date(4000), extraData: '' },
  { id: 2, pluginId: 'p1', manifestURL: 'p1', resourceId: 'r1', type: 'a', createdAt: new Date(3000), updatedAt: new Date(3000), extraData: '' },
  { id: 3, pluginId: 'p1', manifestURL: 'p1', resourceId: 'r1', type: 'a', createdAt: new Date(2000), updatedAt: new Date(2000), extraData: '' },
  { id: 4, pluginId: 'p1', manifestURL: 'p1', resourceId: 'r1', type: 'a', createdAt: new Date(1000), updatedAt: new Date(1000), extraData: '{}' },
]);

beforeAll(() => umzug.up());

const proxy = new ListStateProxy(ActivityFakeProxy);

describe('activity persistance', () => {
  test('db has no entries', () => proxy.get()
    .then((dock: Immutable.List<any>) => {
      expect(dock.size === 0).toBe(true);
    }));

  test('4 entries', () => proxy.set(activityData)
    .then(() => proxy.get())
    .then((dbActivity: Immutable.List<any>) => {
      expect(dbActivity.toJS()).toEqual(expectedActivityData.toJS());
    }));

  test('empty memory cache and load from db', () => {
    proxy.clear();
    return proxy.get()
      .then((dbActivity: Immutable.List<any>) => {
        expect(dbActivity.toJS()).toEqual(expectedActivityData.toJS());
      });
  });
});
