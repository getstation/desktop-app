import { config } from '@getstation/sdk';
import { is } from 'immutable';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx';
import { updateApplicationIcon } from '../../applications/duck';
import { getApplicationManifestURL } from '../../applications/get';
import { getApplicationById, getApplications } from '../../applications/selectors';
import { ApplicationImmutable } from '../../applications/types';
import { StationStore } from '../../types';
import { subscribeStore } from '../../utils/observable';
import { AbstractProvider } from '../common';

export default class ConfigProvider extends AbstractProvider<config.ConfigConsumer> {
  protected store: StationStore;

  constructor(store: StationStore) {
    super();
    this.store = store;
  }

  addConsumer(consumer: config.ConfigConsumer) {
    super.pushConsumer(consumer);
    consumer.setProviderInterface(this.getProviderInterface(consumer));
    super.subscribeConsumer(consumer, () => {});
  }

  setIcon(applicationId: string, url: string) {
    this.store.dispatch(updateApplicationIcon(applicationId, url));
  }

  getConfigData(manifestURL: string): Observable<config.ConfigData[]> {
    const observableState = subscribeStore(this.store);
    return observableState.pipe(
      map(getApplications),
      map(applications => applications.filter(
        application => getApplicationManifestURL(application) === manifestURL)
      ),
      distinctUntilChanged(is),
      map(applications => applications.map((application: ApplicationImmutable) => ({
        applicationId: application.get('applicationId'),
        subdomain: application.get('subdomain'),
      })).toArray()),
    );
  }

  getProviderInterface(consumer: config.ConfigConsumer): config.ConfigProviderInterface {
    return {
      configData: this.getConfigData(consumer.id),
      setIcon: (applicationId: string, url: string) => {
        const state = this.store.getState();
        const application = getApplicationById(state, applicationId);
        if (!application) return;

        const manifestURL = getApplicationManifestURL(application);
        if (consumer.id !== manifestURL) {
          console.warn('Application is not updatable by current consumer');
          return;
        }

        this.setIcon(applicationId, url);
      },
    };
  }
}
