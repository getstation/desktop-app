import { app, webContents } from 'electron';
import { RPC } from '../../lib/types';
import { ExtendedAppMetricsService } from './interface';

export class ExtendedAppMetricsServiceImpl extends ExtendedAppMetricsService implements RPC.Interface<ExtendedAppMetricsService> {

  async getNumberOfWebContents() {
    await app.whenReady();
    return webContents.getAllWebContents().length;
  }

  async getAppMetricsSummary() {
    await app.whenReady();
    const appMetrics = app.getAppMetrics();
    // TODO: See https://electronjs.org/docs/api/process#processgetprocessmemoryinfo
    // to replace deprecated behaviour.
    // const appMetricsMemoryMB = appMetrics.map(m => ((m as any).memory.workingSetSize / 1024));

    const systemMemoryInfo = process.getSystemMemoryInfo();

    return {
      freeMemoryMB: (systemMemoryInfo.free / 1024),
      processCount: appMetrics.length,
      // processMemorySumMB: sum(appMetricsMemoryMB),
      // processMemoryMaxMB: Math.max(...appMetricsMemoryMB),
      // processMemoryMinMB: Math.min(...appMetricsMemoryMB),
      // processMemoryAvgMB: mean(appMetricsMemoryMB),
    };
  }
}
