import * as Immutable from 'immutable';
import { ServicesData } from '../database/model';
import { KeyValueProxyMixin } from '../persistence/mixins';

const parse = (v: string) => Immutable.fromJS(JSON.parse(v));

export class ServicesDataProxyMixin extends KeyValueProxyMixin({
  model: ServicesData,
  key: 'manifestURL',
  mapStateToObject: async state =>
    state.map(value => value.map((value2: any) => JSON.stringify(value2))).toJS(),
  mapObjectToState: async (lines: { manifestURL: string, key: string, value: string}[]) => {
    return Immutable.fromJS(lines.map(l => ({
      manifestURL: l.manifestURL,
      [l.key]: parse(l.value),
    })))
      .groupBy((v: Immutable.Map<string, any>) => v.get('manifestURL'))
      .map((v: Immutable.List<any>) => Immutable.Map().merge(...v.toArray()))
      .map((v: Immutable.Map<string, any>) => v.delete('manifestURL'));
  },
}) {
}
