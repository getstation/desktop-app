import { Observable, Subject } from 'rxjs';
import { Consumer } from '../common';

export namespace config {

  export interface ConfigConsumer extends Consumer {
    readonly id: string;

    /**
     * Get configData for current application
     * @example
     *   sdk.config.configData
     *    .subscribe(configData => {
     *      // ... configData.subdomain
     *    });
     */
    readonly configData: Observable<config.ConfigData[]>;

    /**
     * Update Dock icon for current application with given URL
     * @example
     *  sdk.config.setIcon('https://domain.tld/myicon.png');
     */
    setIcon(applicationId: string, url: string): void;

    setProviderInterface(providerInterface: config.ConfigProviderInterface): void;
  }

  export interface ConfigProviderInterface {
    configData: Subject<config.ConfigData[]>;
    setIcon(applicationId: string, url: string): void;
  }

  export type ConfigData = {
    applicationId: string,
    subdomain?: string,
  };
}
