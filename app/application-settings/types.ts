import { RecursiveImmutableMap } from '../types';

export type ApplicationSettings = {
  manifestURL: string,
  alwaysLoaded: boolean,
  doNotInstall: boolean,
  instanceLogoInDock: boolean,
};

export type ApplicationsSettings = Partial<Record<
  ApplicationSettings['manifestURL'], ApplicationSettings>
>;

export type ApplicationSettingsImmutable = RecursiveImmutableMap<ApplicationSettings>;

export type ApplicationsSettingsImmutable = RecursiveImmutableMap<ApplicationsSettings>;
