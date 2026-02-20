import { ipcRenderer } from 'electron';
import { distinctUntilChanged, map, share } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { uninstallAllInstances } from '../../../abstract-application/duck';
import { setConfigData, uninstallApplication } from '../../../applications/duck';
import { getSnoozeDurationInMs } from '../../../notification-center/selectors';
import { getThemeColors } from '../../../theme/selectors';
import { StationState, StationStoreWorker } from '../../../types';
import { getSimpleIdentitiesForProvider } from '../../../user-identities/selectors';
import { subscribeStore } from '../../../utils/observable';
import { handleError } from '../../api/helpers';
import { ServiceSubscription } from '../../lib/class';
import { observer } from '../../lib/helpers';
import { RPC } from '../../lib/types';
import { SDKv2Actions, SDKv2Selectors, SDKv2Service, SDKv2ServiceObserver } from './interface';

const bxAPIAllowedActions = [
  {
    channel: SDKv2Actions.InstallApplication,
    // Avoid circular imports
    sagaMethod: () => import('../../../app-store/sagas').then(x => x.addApplicationRequest),
    allowedParameters: ['manifestURL', 'context', 'inBackground'],
  },
  {
    channel: SDKv2Actions.UninstallApplication,
    action: uninstallApplication,
    allowedParameters: ['applicationId'],
  },
  {
    channel: SDKv2Actions.UninstallApplications,
    action: uninstallAllInstances,
    allowedParameters: ['manifestURL'],
  },
  {
    channel: SDKv2Actions.SetApplicationConfigData,
    action: setConfigData,
    allowedParameters: ['applicationId', 'configData'],
  },
  {
    channel: SDKv2Actions.RequestLogin,
    // Avoid circular imports
    sagaMethod: () => import('../../../user-identities/sagas').then(x => x.callRequestSignIn),
    allowedParameters: ['provider'],
  },
  {
    channel: SDKv2Actions.SearchApplication,
    // Avoid circular imports
    sagaMethod: () => import('../../../app-store/sagas').then(x => x.searchApplication),
    allowedParameters: ['query'],
  },
  {
    channel: SDKv2Actions.GetMostPopularApplication,
    // Avoid circular imports
    sagaMethod: () => import('../../../app-store/sagas').then(x => x.getMostPopularApplications),
    allowedParameters: [],
  },
  {
    channel: SDKv2Actions.GetAllCategories,
    // Avoid circular imports
    sagaMethod: () => import('../../../app-store/sagas').then(x => x.getAllCategories),
    allowedParameters: [],
  },
  {
    channel: SDKv2Actions.RequestPrivateApplication,
    // Avoid circular imports
    sagaMethod: () => import('../../../app-store/sagas').then(x => x.requestPrivateApplication),
    allowedParameters: ['name', 'themeColor', 'bxIconURL', 'startURL', 'scope'],
  },
  {
    channel: SDKv2Actions.GetPrivateApplications,
    // Avoid circular imports
    sagaMethod: () => import('../../../app-store/sagas').then(x => x.getPrivateApplications),
    allowedParameters: [],
  },
  {
    channel: SDKv2Actions.GetApplicationsByCategory,
    // Avoid circular imports
    sagaMethod: () => import('../../../app-store/sagas').then(x => x.getApplicationsByCategory),
    allowedParameters: [],
  },
  {
    channel: SDKv2Actions.GetManifestByURL,
    // Avoid circular imports
    sagaMethod: () => import('../../../app-store/sagas').then(x => x.getManifestByURL),
    allowedParameters: ['manifestURL'],
  },
];

const bxAPIAllowedSelectorsObservers = [
  {
    channel: SDKv2Selectors.GetSnoozeDuration,
    selector: getSnoozeDurationInMs,
  },
  {
    channel: SDKv2Selectors.GetThemeColors,
    selector: getThemeColors,
  },
  {
    channel: SDKv2Selectors.GetAllIdentities,
    selector: (state: StationState) => getSimpleIdentitiesForProvider(state, 'google'),
  },
];

const generateParams = (allowedParameters: string[], payload?: any): string[] => {
  if (!payload) return [];
  return allowedParameters.map((allowedParameter: string) => payload[allowedParameter]);
};

export class SDKv2ServiceImpl extends SDKv2Service implements RPC.Interface<SDKv2Service> {

  protected store: StationStoreWorker;
  protected observableStore: Observable<StationState>;

  constructor(uuid?: string) {
    super(uuid);
    if (this.uuid === '__default__') {
      initPreloadListener(this);
    }
  }

  setStore(store: StationStoreWorker) {
    this.store = store;
    this.observableStore = subscribeStore(store).pipe(share()) as Observable<StationState>;
  }

  async callAction(channel: SDKv2Actions | SDKv2Selectors, payload: any) {
    const bxAPIAction = bxAPIAllowedActions.find(action => action.channel === channel);

    if (bxAPIAction) {
      if (bxAPIAction.sagaMethod) {
        let body;
        const sagaMethod = await bxAPIAction.sagaMethod();
        const params = generateParams(bxAPIAction.allowedParameters, payload);
        body = await (this.store.runSaga as Function)(sagaMethod, ...params).toPromise();

        if (body) {
          return {
            body,
          };
        }
      } else if (bxAPIAction.action) {
        const params = generateParams(bxAPIAction.allowedParameters, payload);
        this.store.dispatch((bxAPIAction.action as Function)(...params));
      }
      return;
    }

    throw new Error(`Channel ${channel} not found`);
  }

  async addObserver(channel: SDKv2Actions | SDKv2Selectors, obs: RPC.ObserverNode<SDKv2ServiceObserver>) {
    if (!obs.on) return ServiceSubscription.noop;

    const selectorObserver = bxAPIAllowedSelectorsObservers.find(selector => selector.channel === channel);

    if (selectorObserver) {
      const sub = this.observableStore
        .pipe(
          map(state => {
            if (typeof selectorObserver.selector === 'function') {
              return selectorObserver.selector(state);
            }
            return selectorObserver.selector;
          }),
          distinctUntilChanged()
        ).subscribe((value: any) => {
          obs.on!(value);
        });

      return new ServiceSubscription(sub);
    }

    throw new Error(`Channel ${channel} not found`);
  }
}

const initPreloadListener = (sdkv2: SDKv2ServiceImpl) => {
  ipcRenderer.on('bx-api-subscribe', async (event: Electron.Event, { senderId }: { senderId: number }, channel: SDKv2Selectors) => {
    try {
      const subscription = await sdkv2.addObserver(channel, observer({
        on(result: any) {
          // Use proxy through main process instead of deprecated sendTo
          ipcRenderer.send('bx-api-response', senderId, `bx-api-subscribe-response-${channel}`, result);
        },
      }));

      // Listen for destroy event from main proxy if needed, or rely on existing mechanism
      // For now, keeping existing logic but adapted if possible.
      // Note: 'wc-destroyed' usually comes from main, we might need to forward that too if used.
      // Assuming wc-destroyed is still sent via sendTo or similar mechanism from main.
      ipcRenderer.once(`wc-destroyed-${senderId}`, () => {
        subscription && subscription.unsubscribe();
      });
    } catch (e) {
      handleError()(e);
    }
  });

  ipcRenderer.on('bx-api-perform', (event: Electron.Event, { senderId }: { senderId: number }, channel: SDKv2Selectors, payload?: any) => {
    console.log(`[DEBUG] worker.ts: received bx-api-perform from senderId=${senderId}, channel=${channel}`);
    sdkv2.callAction(channel, payload)
      .then(result => {
        console.log(`[DEBUG] worker.ts: sending response for channel=${channel} to senderId=${senderId}`);
        // Use proxy through main process instead of deprecated sendTo
        ipcRenderer.send('bx-api-response', senderId, `bx-api-perform-response-${channel}`, result);
      })
      .catch(handleError());
  });
};
