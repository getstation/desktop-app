import * as Immutable from 'immutable';

import { SingletonStateProxy } from '../../persistence/backend';
import { SingletonProxyMixin } from '../../persistence/mixins';

export default function getUIProxy(models: any) {
  const { UI } = models;

  class UIProxy extends SingletonProxyMixin({
    model: UI,
    mapStateToObject: async () => ({}),
    mapObjectToState: async () => Immutable.Map({}),
  }) {
  }

  return new SingletonStateProxy(UIProxy);
}
