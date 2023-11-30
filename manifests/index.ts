import * as Fuse from 'fuse.js';
import { getChromeExtensionId } from '../app/abstract-application/helpers';
import { MinimalApplication } from '../app/applications/graphql/withApplications';
import { BxAppManifest } from '../app/applications/manifest-provider/bxAppManifest';
import { ApplicationItem } from '../app/urlrouter/types';
import { getPrivateApplicationById, getPrivateManifests } from './private';

const reqIcon = require.context('!url-loader!./icons', true, /\.(png|svg)$/);
const reqManifest = require.context('./definitions', true, /\.json$/);

export type Manifest = Omit<BxAppManifest, 'icons'> & { id: string, icon: string };
export type PopularApps = { creamOfTheCropApps: MinimalApplication[], runnerUps: MinimalApplication[], noteworthy: MinimalApplication[] };

/**
 * Get basename of a file, without extension
 * @param path
 * @returns {string}
 */
function basename(path: string): string {
  return path.replace(/.*\/|\.[^.]*$/g, '');
}

/**
 * Returns a list of all applications ids
 * @returns {string[]}
 */
export function getAllApplicationIds(): string[] {
  const svgManifest = reqManifest.keys();
  const ids = svgManifest.map(filepath => basename(filepath));
  const privateIds = getPrivateManifests().map(app => String(app.id));
  return [...ids, ...privateIds];
}

/**
 * Returns a dictionary of all applications manifests indexed by id
 * @returns {Record<string, Manifest}
 */
export function allApplicationsDictionary(): Record<string, Manifest> {
  const ids = getAllApplicationIds();
  return ids.reduce((acc, id) => {
    acc[id] = getApplicationById(id);
    return acc;
  }, {});
}

export function listMostPopularApplications(): PopularApps {
  const apps = listAllApplications().filter(app => app.recommendedPosition && app.recommendedPosition > 0);
  const sorted = apps.sort((a, b) => (a.recommendedPosition ?? 0) - (b.recommendedPosition ?? 0));

  return {
    creamOfTheCropApps: sorted.slice(0, 10).map(manifestToMinimalApplication),
    runnerUps: sorted.slice(10, 20).map(manifestToMinimalApplication),
    noteworthy: sorted.slice(20, 30).map(manifestToMinimalApplication),
  };
}

/**
 * Returns a list off all applications manifests
 * @returns {Manifest[]}
 */
export function listAllApplications(): Manifest[] {
  const ids = getAllApplicationIds();
  return ids.map(getApplicationById).filter(app => !app.doNotList);
}

/**
 * Return the manifest of the given id
 * @param id
 * @returns {Manifest}
 */
export function getApplicationById(id: string): Manifest {
  if (Number(id) > 1000000) {
    return getPrivateApplicationById(Number(id))!;
  }

  const svgIconName = `./${id}.svg`;
  const pngIconName = `./${id}.png`;
  const iconData: string = reqIcon.keys().indexOf(svgIconName) >= 0
                            ? reqIcon(svgIconName).default
                            : reqIcon(pngIconName).default;
  const manifest: BxAppManifest = reqManifest(`./${id}.json`);

  delete manifest.icons;
  (manifest as Manifest).icon = iconData;
  (manifest as Manifest).id = id;

  return manifest as Manifest;
}

export function getBxAppManifestURL(id: string | number) {
  return `station-manifest://${id}`;
}

export function manifestToMinimalApplication(manifest: Manifest): MinimalApplication {
  return ({
    id: manifest.id,
    name: manifest.name ?? '',
    bxAppManifestURL: getBxAppManifestURL(manifest.id),
    iconURL: manifest.icon,
    themeColor: manifest.theme_color ?? '',
    isChromeExtension: Boolean(getChromeExtensionId(manifest)),
    recommendedPosition: manifest.recommendedPosition ? Number(manifest.recommendedPosition) : 0,
  });
}

export function manifestToApplicationItem(manifest: Manifest): ApplicationItem {
  const { id, name = '', scope = '', extended_scopes = [] } = manifest;
  return ({
    name,
    bxAppManifestURL: getBxAppManifestURL(id),
    manifest: {
      scope,
      extended_scopes,
    },
  });
}

/**
 * Search in all applications manifests
 * in keys: name
 * @param query
 * @returns {Manifest[]}
 */
export function search(query: string): MinimalApplication[] {
  const fuse = new Fuse(listAllApplications().map(manifestToMinimalApplication), {
    threshold: 0.4,
    keys: ['name'],
  });

  return fuse.search(query);
}
