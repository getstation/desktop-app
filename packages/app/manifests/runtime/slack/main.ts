import { SDK } from '@getstation/sdk';
import { HistoryConsumer } from '@getstation/sdk/lib/history/consumer';
import { merge, Observable } from 'rxjs';
import { startActivityRecording, stopActivityRecording } from '../common/activity';
import { resourceExtractor } from './activity';
import { startHistoryRecording, stopHistoryRecording } from './history';
import NotificationOverride from './notification';
import { setResourcesHandlers } from './resources';
import SlackSearch from './search';
import SnoozeSynchronizer from './sync-snooze';

const snoozeSynchronizer = new SnoozeSynchronizer();
const notifOverride = new NotificationOverride();

export default {
  activate: async (sdk: SDK, bx: any): Promise<Observable<Error>> => {
    const manifestURL = sdk.storage.id;
    sdk.register(new HistoryConsumer(manifestURL));
    return merge(
      await snoozeSynchronizer.activate(bx),
      await notifOverride.activate(bx),
      await SlackSearch.activate(sdk),
      await startActivityRecording(sdk, manifestURL, resourceExtractor),
      await startHistoryRecording(sdk),
      await setResourcesHandlers(sdk)
    );
  },

  deactivate: (sdk: SDK): void => {
    snoozeSynchronizer.deactivate();
    notifOverride.deactivate();
    SlackSearch.deactivate();
    stopActivityRecording(sdk);
    stopHistoryRecording();
    sdk.close();
  },
};
