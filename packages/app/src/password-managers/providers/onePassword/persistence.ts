import * as Immutable from 'immutable';
import { MapStateProxy } from '../../../persistence/backend';
import { MapProxyMixin } from '../../../persistence/mixins';
import { PasswordManagers } from '../../../database/model';

const OnePasswordProxyMixin = MapProxyMixin({
  model: PasswordManagers.OnePassword,
  key: 'id',
  mapStateToObject: async (state: Immutable.Map<string, any>) => {
    if (!state) return {};
    return {
      id: state.get('domain'),
      domain: state.get('domain'),
      email: state.get('email'),
      secretKey: state.get('secretKey'),
    };
  },
  mapObjectToState: async (obj: any) => Immutable.Map({
    id: obj.domain,
    domain: obj.domain,
    email: obj.email,
    secretKey: obj.secretKey,
  }),
});

class OnePasswordProxy extends OnePasswordProxyMixin {}

export default new MapStateProxy(OnePasswordProxy);
