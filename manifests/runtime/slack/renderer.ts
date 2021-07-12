
import { SDK } from '@getstation/sdk';
import createUnifiedSearchSynced from '../common/components/createUnifiedSearchSynced';

export default {
  activate: (sdk: SDK): void => {
    const Component = createUnifiedSearchSynced('slack');
    sdk.react.createPortal(Component, 'quickswitch');
  },

  deactivate: (): void => {
    // TODO removePortal
  },
};
