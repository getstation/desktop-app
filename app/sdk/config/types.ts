import { search } from '@getstation/sdk';

/**
 * This represents a set of results grouped by section (which is computed for categories).
 * `bxSDK.search.provider.results` results are SearchSection[].
 * In the state, results are stored in the following format: Map<section: string, SearchSection>
 * We use SearchSection[] instead of flattened results because:
 * - We would need to store sections order in a separate attribute, and re-group in a selector
 * - Some operation in the pipe of the search are scoped by section
 * - Some are not, but it's easy to flatten temporarily
 */
export interface SearchSection {
  sectionName: string,
  results?: search.SearchResultItem[],
  loading?: boolean,
}
