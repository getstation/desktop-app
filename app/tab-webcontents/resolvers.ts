import * as Immutable from 'immutable';
import { distinctUntilChanged } from 'rxjs/operators';
import { getTabWebcontentsById } from '../../app/tab-webcontents/selectors';
import { IResolvers } from '../graphql/resolvers-types.generated';
import { subscribeStore } from '../utils/observable';

const resolvers: IResolvers = {
  Query: {
    getTabWebContent: (_obj, args, context) => {
      return subscribeStore(
        context.store,
        state => getTabWebcontentsById(state, args.tabId)
      ).pipe(distinctUntilChanged(Immutable.is));
    },
  },
};

export default resolvers;
