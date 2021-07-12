import { ServiceBase } from '../../lib/class';
import { service } from '../../lib/decorator';
import { RPC } from '../../lib/types';

export interface AppMetricsSummary {
  freeMemoryMB: number,
  processCount: number,
  // processMemorySumMB: number,
  // processMemoryMaxMB: number,
  // processMemoryMinMB: number,
  // processMemoryAvgMB: number,
}

@service('extended-app-metrics')
export class ExtendedAppMetricsService extends ServiceBase implements RPC.Interface<ExtendedAppMetricsService> {
  // @ts-ignore
  async getNumberOfWebContents(): Promise<number> {}
  // @ts-ignore
  async getAppMetricsSummary(): Promise<AppMetricsSummary> {}
}
