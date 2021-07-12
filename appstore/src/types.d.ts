import { MinimalApplication } from '../../app/applications/graphql/withApplications';

interface System {
  import<T = any>(module: string): Promise<T>
}
declare var System: System;
