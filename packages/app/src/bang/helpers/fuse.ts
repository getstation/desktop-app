import { search } from '@getstation/sdk';
import * as Fuse from 'fuse.js';
// @ts-ignore: no declaration file
import * as isBlank from 'is-blank';

type Item = search.SearchResultItem;

const defaultFuseOption: Fuse.FuseOptions<Item> = {
  keys: ['label', 'additionalSearchString'],
  shouldSort: true,
  threshold: 0.2,
};

export const createFuseSearch = (
  fuseCommands: any[],
  limit: number | undefined = undefined,
  options: Fuse.FuseOptions<Item> = defaultFuseOption
) => {
  const fuse = new Fuse(fuseCommands, options);
  return (searchValue?: string): search.SearchResultWrapper => {
    const results = isBlank(searchValue) ? fuseCommands : fuse.search(searchValue!);
    return { results: results.slice(0, limit) };
  };
};
