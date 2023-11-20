import { ApolloLink, ExecutionResult, NextLink, Observable as ZenObservable, Operation } from 'apollo-link';
import log from 'electron-log';
import { equals, pick } from 'ramda';
import { from } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { isPackaged } from '../utils/env';

const filterResult = pick(['data', 'errors']);

/**
 * Shallow equals that, in dev mode only, warns of duplicated results
 */
export const compare = (operation: Operation) => <T>(a: ExecutionResult<T>, b: ExecutionResult<T>) => {
  if (equals(filterResult(a), filterResult(b))) {
    if (!isPackaged) {
      log.silly(`Subsequent calls to onResponse with the same results for ${operation.operationName}`);
    }
    return true;
  }
  return false;
};

/**
 * Before sending a result, it is compared to the previous item.
 * If they match, new result is not sent.
 */
export class DistinctConsecutiveResultsLink extends ApolloLink {
  request(operation: Operation, forward: NextLink) {
    const observable = forward(operation);
    // zen -> rx -> distinct -> zen
    return ZenObservable.from(
      // @ts-ignore: TS definitions slightly incompatible, but it works like a charm
      from(observable)
        .pipe(distinctUntilChanged(compare(operation)))
    );
  }
}
