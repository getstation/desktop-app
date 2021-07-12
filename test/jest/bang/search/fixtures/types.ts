export type FrecencyData = {
  queries: Record<string, {
    id: string,
    timesSelected: number,
    selectedAt: number[],
  }[]>,
  selections: Record<string, {
    timesSelected: number,
    selectedAt: number[],
    queries: Record<string, boolean>,
  }>,
  recentSelections: string[],
};
