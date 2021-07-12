import { observer, shallowEquals } from 'redux-observers';
import { getForeFrontNavigationStateProperty } from '../applications/utils';
import { getAppBadge } from '../applications/selectors';
import { getActiveApplicationId } from '../nav/selectors';
import { changeSelectedAppMain } from '../nav/duck';
import services from '../services/servicesManager';


// upon remove of an app item, make sure that if the item was active
// an other one gets active
// TODO: not sure if this works well

const observeRemoveActiveAppFromDock = observer(
  null,
  (dispatch, state, previousState) => {
    const dock = state.get('dock');
    const prevDock = previousState.get('dock');

    if (shallowEquals(dock, prevDock)) { return; }

    const removedAppItems = prevDock.filter(appId => !dock.includes(appId));
    if (removedAppItems.size === 0) { return; }

    const previousApplicationId = previousState.getIn(['nav', 'previousTabApplicationId']);
    const previousApplicationIdExists = Boolean(state.getIn(['applications', previousApplicationId]));

    if (previousApplicationIdExists) {
      dispatch(changeSelectedAppMain(previousApplicationId));
      return;
    }

    const activeApplicationId = getActiveApplicationId(state);
    if (!removedAppItems.includes(activeApplicationId)) { return; }

    let nextActiveAppId;
    const activeAppDockPosition = prevDock.indexOf(activeApplicationId);

    if (dock.size === 0) {
      return;
    } else if (activeAppDockPosition >= prevDock.size - 1) {
      // was the last one
      nextActiveAppId = dock.last();
    } else {
      nextActiveAppId = dock.get(activeAppDockPosition);
    }

    dispatch(changeSelectedAppMain(nextActiveAppId));
  },
);

const observeBackAndForwardState = observer(
  null,
  (dispatch, state, previousState) => {
    const prevBackForwardState = {
      canGoBack: getForeFrontNavigationStateProperty(previousState, 'canGoBack'),
      canGoForward: getForeFrontNavigationStateProperty(previousState, 'canGoForward')
    };

    const backForwardState = {
      canGoBack: getForeFrontNavigationStateProperty(state, 'canGoBack'),
      canGoForward: getForeFrontNavigationStateProperty(state, 'canGoForward')
    };

    if (shallowEquals(prevBackForwardState, backForwardState)) return;

    services.menu.setEnabled({
      menuItemId: 'page-go-back',
      value: backForwardState.canGoBack,
    }).catch(console.error); // FIXME
    services.menu.setEnabled({
      menuItemId: 'page-go-forward',
      value: backForwardState.canGoBack
    }).catch(console.error); // FIXME
  },
);

const updateAppBadge = observer(getAppBadge, (dispatch, appBadge) => {
  let badge = '';
  if (appBadge !== 'snooze' && appBadge !== null) {
    badge = `${appBadge}`;
  }
  services.electronApp.dockSetBadge(badge);
});

export default [
  observeRemoveActiveAppFromDock,
  observeBackAndForwardState,
  updateAppBadge,
];
