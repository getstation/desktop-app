import memoize = require('memoizee');
import Maybe from 'graphql/tsutils/Maybe';

import { JAVASCRIPT_INJECTIONS } from '../applications/manifest-provider/const';

export const injectJS = memoize(
  async (legacyServiceId: Maybe<string>): Promise<string | undefined> => {
    if (!legacyServiceId) return;
    const scriptsFiles: string[] = JAVASCRIPT_INJECTIONS[legacyServiceId];

    if (scriptsFiles) {
      return scriptsFiles.map(
        (script: string) => require(`!!raw-loader!./injected-js/${script}.js`).default
      )
      .map(s => `(function(){\n${s}\n})()`)
      .join(' ');
    }

    return;
  },
  { promise: true }
);
