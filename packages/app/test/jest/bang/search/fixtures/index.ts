import { join } from 'path';
import { readFileSync } from 'fs';
import { FrecencyData } from './types';

export { FrecencyData };

export type SearchResultFixture = {
  searchResults: any[],
  queryValue: string,
};

const readFixture = (fixturePath: string) =>
  JSON.parse(readFileSync(join(__dirname, fixturePath), 'utf8'));

const readSearchResultFixture = (fixturePath: string): SearchResultFixture =>
  readFixture(fixturePath) as SearchResultFixture;

export const contextualFrecencyData: FrecencyData =
  readFixture('contextual-frecency-data.json');

export const case1 = {
  i: readSearchResultFixture('case1/i.json'),
  s: readSearchResultFixture('case1/s.json'),
};

export const case2 = {
  s: readSearchResultFixture('case2/s.json'),
  sp: readSearchResultFixture('case2/sp.json'),
  spe: readSearchResultFixture('case2/spe.json'),
  spen: readSearchResultFixture('case2/spen.json'),
  a: readSearchResultFixture('case2/a.json'),
  ag: readSearchResultFixture('case2/ag.json'),
  ago: readSearchResultFixture('case2/ago.json'),
  agor: readSearchResultFixture('case2/agor.json'),
};

export const case3and4 = {
  alex: readSearchResultFixture('case3_4/alex.json'),
  alexa: readSearchResultFixture('case3_4/alexa.json'),
  alexan: readSearchResultFixture('case3_4/alexan.json'),
  alexand: readSearchResultFixture('case3_4/alexand.json'),
  alexandr: readSearchResultFixture('case3_4/alexandr.json'),
  alexandre: readSearchResultFixture('case3_4/alexandre.json'),
};

export const case5 = {
  hug: readSearchResultFixture('case5/hug.json'),
  hugo: readSearchResultFixture('case5/hugo.json'),
};

export const case6 = {
  inves: readSearchResultFixture('case6/inves.json'),
  tod: readSearchResultFixture('case6/tod.json'),
};

export const case7 = {
  ats_b: readSearchResultFixture('case7/ats_b.json'),
};
