import * as Immutable from 'immutable';

import onePasswordProxy from '../providers/onePassword/persistence';

export default function getPasswordManagers() {
  return {
    get: async () => Immutable.Map({
      onePassword: await onePasswordProxy.get(),
    }),
    set: async (state: Immutable.Map<string, any>) => ({
      onePassword: onePasswordProxy.set(state.get('onePassword')),
    }),
  };
}
