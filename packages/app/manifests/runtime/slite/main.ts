import { SDK } from '@getstation/sdk';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

async function getSliteTeamIcon(subdomain: string) {
  const res = await fetch(`https://slite.com/api/organizations/domains/${subdomain}`);
  const resJson = await res.json();

  return resJson.included[0].attributes.photoURL;
}

let subscription: Subscription;

export default {
  activate: async (sdk: SDK) => {
    const errorSubject = new Subject<Error>();
    subscription = sdk.config.configData
      .pipe(
        distinctUntilChanged()
      )
      .subscribe(
        async (configData) => {
          for (const c of configData) {
            if (!c.subdomain) continue;
            const icon = await getSliteTeamIcon(c.subdomain);
            sdk.config.setIcon(c.applicationId, icon);
          }
        },
        (err: Error) => errorSubject.next(err)
      );
    return errorSubject;
  },

  deactivate: (sdk: SDK): void => {
    if (subscription) {
      subscription.unsubscribe();
    }
    sdk.close();
  },
};
