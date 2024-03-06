import { RPC } from '../services/lib/types';
import services from '../services/servicesManager';
import { OSNotification } from '../services/services/os-notification/interface';

export const showOSNotification = async ({ title, body, imageURL, silent }:
  { title: string, body?: string, imageURL?: string, silent?: boolean }): Promise<RPC.Node<OSNotification>> => {

  return await services.osNotification.show({
    title, body, imageURL, silent,
  });
};
