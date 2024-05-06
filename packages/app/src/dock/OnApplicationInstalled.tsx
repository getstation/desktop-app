import { useSubscription } from 'react-apollo-hooks';
import { OnApplicationInstalledDocument, OnApplicationInstalledQuery } from './queries@local.gql.generated';

type Props = {
  callback: (applicationId: string) => void,
};

export const OnApplicationInstalled = ({ callback }: Props) => {
  useSubscription<OnApplicationInstalledQuery>(OnApplicationInstalledDocument, {
    onSubscriptionData: ({ subscriptionData }) => {
      if (!subscriptionData || !subscriptionData.data) return;
      callback(subscriptionData.data.onApplicationInstalled.applicationId);
    },
  });
  return null;
};
