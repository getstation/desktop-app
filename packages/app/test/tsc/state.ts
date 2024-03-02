import { StationTab, StationTabImmutable, StationTabsImmutable } from '../../app/tabs/types';
import { ImmutableList, StationState } from '../../app/types';
import { StationUserIdentitiesImmutable, StationUserIdentityImmutable } from '../../app/user-identities/types';

{
  const a: StationState = {} as any;
  const b: StationTabsImmutable = a.get('tabs');
  const c: StationTabImmutable = b.get('abc')!;
  const d: ImmutableList<string[]> = c.get('favicons');
  const c1: StationTabImmutable = c.setIn(['favicons', 0], 'yeay');
  const e1: string = d.getIn([0]);
  const e2: string = d.get(0);

  const f: StationTab = c.toJS();
  const g: string[] = f.favicons;

  const h1 = c.map(_ => ({ a: { a: 'a' } }));
  const h2 = b.filter(tx => Boolean(tx.get('url')));
  const i = h1.getIn(['a']);

  const j: StationUserIdentitiesImmutable = a.get('userIdentities');
  const k: StationUserIdentityImmutable = j.get('abc');
  const l1: StationUserIdentitiesImmutable = j.remove('def');
  const l2: StationUserIdentitiesImmutable = j.delete('def');

  const m: StationState = a.setIn(['tabs'], a.getIn(['tabs']));
  const n: StationState = a.setIn(['tabs', 'abc'], a.getIn(['tabs', 'abc']));
  const o: StationState = a.setIn(['tabs', 'abc', 'favicons'], a.getIn(['tabs', 'abc', 'favicons']));
  const p: StationState = a.setIn(['tabs', 'abc', 'favicons', 0], a.getIn(['tabs', 'abc', 'favicons', 0]));
}
