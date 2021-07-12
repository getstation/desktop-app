import { GraphQLError } from 'graphql';
import { ServiceBase } from '../../lib/class';
import { service } from '../../lib/decorator';
import { RPC } from '../../lib/types';

export interface SerializedGraphQLRequest {
  query: string;
  variables?: object;
  operationName?: string;
  context?: Record<string, any>;
  extensions?: Record<string, any>;
}

export interface SerializedExecutionResult {
  data?: object;
  errors?: GraphQLError[];
}

@service('apollo-link')
export class ApolloLinkService extends ServiceBase implements RPC.Interface<ApolloLinkService> {
  // @ts-ignore
  request(req: SerializedGraphQLRequest, obs: RPC.Node<ApolloLinkServiceObserver>): Promise<RPC.Subscription> {}
}

@service('apollo-link', { observer: true })
export class ApolloLinkServiceObserver extends ServiceBase implements RPC.Interface<ApolloLinkServiceObserver> {
  // @ts-ignore
  onResponse(res: SerializedExecutionResult): void {}
  // @ts-ignore
  onComplete(): void {}
  // @ts-ignore
  onError(e: Error): void {}
}
