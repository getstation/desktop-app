import { oc } from 'ts-optchain';
import { Application } from './types';

export const getNbSubdockItems = (application: Application): number => {
  const nbTabs = oc(application.orderedTabsForSubdock).length(0);
  const nbFavs = oc(application.orderedFavoritesForSubdock).length(0);
  const nbHomes = application.tabApplicationHome ? 1 : 0;

  return nbTabs + nbFavs + nbHomes;
};
