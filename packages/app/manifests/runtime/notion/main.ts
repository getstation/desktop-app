import { SDK } from '@getstation/sdk';
import { HistoryConsumer } from '@getstation/sdk/lib/history/consumer';
import { merge, Observable } from 'rxjs';
import {
  startActivityRecording,
  stopActivityRecording,
} from '../common/activity';
import { resourceExtractor } from './activity';
import {
  startHistoryRecording,
  stopHistoryRecording,
} from './history';
import { setResourcesHandlers } from './resources';
import Search from './search';

export const serviceName = 'Notion';
export const serviceDomain = 'https://www.notion.so';
export const logo = 'https://s3.eu-west-2.amazonaws.com/getstation.com/' +
  'station-services/icons/icon--provider/icon-provider--notion.svg';

export default {
  activate: async (sdk: SDK): Promise<Observable<Error>> => {
    const manifestURL = sdk.storage.id;
    sdk.register(new HistoryConsumer(manifestURL));
    return merge(
      await Search.activate(sdk),
      await startActivityRecording(sdk, manifestURL, resourceExtractor),
      await startHistoryRecording(sdk),
      await setResourcesHandlers(sdk)
    );
  },

  deactivate: (sdk: SDK): void => {
    Search.deactivate();
    stopActivityRecording(sdk);
    stopHistoryRecording();
    sdk.close();
  },
};
