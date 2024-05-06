import { SearchResultSerialized } from '../bang/duck';

export type ActivityEntry = SearchResultSerialized & {
  applicationId: string,
};
