import { ComponentType } from 'react';
import { oc } from 'ts-optchain';

import {
  withGetApplicationState,
  GetApplicationStateQuery,
} from '../../applications/queries@local.gql.generated';

type EnhancedProps = {
  isApplicationLoading: boolean,
  application: GetApplicationStateQuery['application'] | undefined,
};

/**
 * Take a component and return a enhanced version of this component
 * including the `isApplicationLoading` and `application` props.
 *
 * @param component input
 * @return enhanced component
 */

const withApplication = <OwnProps>(component: ComponentType<OwnProps>) => {
  type Props = OwnProps & EnhancedProps;
  return withGetApplicationState<OwnProps, EnhancedProps>({
    options: (props: OwnProps) => ({ variables: { applicationId: props.applicationId } }),
    props: ({ data }) => ({
      isApplicationLoading: !data || data.loading,
      application: oc(data).application(),
    }),
  })(component as any) as ComponentType<Props>;
};

export default withApplication;
