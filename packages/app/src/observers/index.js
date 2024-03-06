import appObservers from '../app/observers';
import dockObservers from '../dock/observers';
import navObservers from './nav';
import tabWebcontents from '../tab-webcontents/observer';
import subwindows from '../subwindows/observers';
import applications from '../applications/observers';
import windows from '../windows/observers';
import plugins from '../plugins/observers';

const observers = [
  ...appObservers,
  ...dockObservers,
  ...navObservers,
  ...applications,
  ...tabWebcontents,
  ...applications,
  ...windows,
  ...plugins,
];

export const delayedObservers = [...subwindows];

export default observers;
