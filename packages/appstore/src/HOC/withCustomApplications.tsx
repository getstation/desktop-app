import * as React from 'react';
import { ApplicationsAvailable } from '@src/graphql/queries';

export type WithCustomApplicationsProps = {
  privateApps: ApplicationsAvailable[],
  loading: boolean,
};

export default function withCustomApplications(Component: React.Component<any>) {
  return (props: any) => {
    const [data, setData] = React.useState<WithCustomApplicationsProps>({
      privateApps: [],
      loading: true,
    });

    React.useEffect(() => {
      window.bxApi.applications.getPrivateApps().then(({ body }) => {
        setData({
          privateApps: body.map(app => {
            return {
              id: app.id,
              bxAppManifestURL: `station-manifest://${app.id}`,
              iconURL: app.icon,
              isPrivate: true,
              category: {
                name: 'Miscellaneous',
              },
              name: app.name,
              isChromeExtension: false,
              themeColor: app.theme_color,
              startURL: app.start_url,
            };
          }),
          loading: false,
        });
      });
    }, []);

    return <Component {...props} {...data} />;
  };
}
