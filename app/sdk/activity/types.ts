import { activity } from '@getstation/sdk';

export type GlobalActivityEntry = activity.ActivityEntry & {
  pluginId: string,
};

export type SerializedActivityEntry = activity.ActivityEntry & {
  id: number,
  pluginId: string,
  extraData?: string,
};
