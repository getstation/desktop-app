import * as React from 'react';
import { oc } from 'ts-optchain';
import { useGetApplicationQuery } from '../queries@local.gql.generated';
import { AppearingAppDockIcon, OwnProps } from './AppDockIcon';

const ConnectedAppDockIcon = (props: OwnProps) => {
  const { data, loading } = useGetApplicationQuery({
    variables: {
      applicationId: props.applicationId,
    },
  });

  return (
    <AppearingAppDockIcon
      themeColor={oc(data).application.manifestData.theme_color() || undefined}
      loading={loading}
      iconURL={oc(data).application.manifestData.interpretedIconURL() || undefined}
      snoozed={oc(data).application.isSnoozed()}
      {...props}
    />
  );
};

export default ConnectedAppDockIcon;
