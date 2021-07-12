import * as Immutable from 'immutable';

import { MapStateProxy } from '../../persistence/backend';
import { MapProxyMixin } from '../../persistence/mixins';

export default function getPasswordManagerLinks(models: any) {
  const { PasswordManagers } = models;

  const PasswordManagerLinkProxyMixin = MapProxyMixin({
    model: PasswordManagers.Link,
    key: 'applicationId',
    mapStateToObject: async (state: Immutable.Map<string, any>) => {
      if (!state) return {};
      return {
        applicationId: state.get('applicationId'),
        providerId: state.get('providerId'),
        passwordManagerId: state.get('passwordManagerId'),
        passwordManagerItemId: state.get('passwordManagerItemId'),
        login: state.get('login'),
        avatar: state.get('avatar'),
      };
    },
    mapObjectToState: async (obj: any) => Immutable.Map({
      applicationId: obj.applicationId,
      providerId: obj.providerId,
      passwordManagerId: obj.passwordManagerId,
      passwordManagerItemId: obj.passwordManagerItemId,
      login: obj.login,
      avatar: obj.avatar,
    }),
  });

  class PasswordManagerLinkProxy extends PasswordManagerLinkProxyMixin {}

  return new MapStateProxy(PasswordManagerLinkProxy);
}
