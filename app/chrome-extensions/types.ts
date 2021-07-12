import { RecursiveImmutableMap } from '../types';
import { StatusState } from './duck';

export type Extension = {
  id: string;
  version: {
    number: string;
    parsed: number[];
  };
  location: string;
  updateUrl: string;
};

export type ExtensionState = {
  status: StatusState,
  extension?: Extension,
  extensionUpdate?: Extension,
};

export type ExtensionsSet = Partial<Record<Extension['id'], Extension>>;

export type Extensions = {
  loaded: ExtensionsSet,
  updatable: ExtensionsSet,
  checking: ExtensionsSet,
};

export type ChromeExtensionsImmutable = RecursiveImmutableMap<Extensions>;

export type ExtensionEventMessage<T = any> = {
  channel: string,
  payload: T,
};
