import { getUrlToLoad } from '../../utils/dev';
import { isDarwin } from '../../utils/process';
import { getResourceIconPath } from '../../utils/resources';
import { windowCreated } from '../duck';
import GenericWindowManager from './GenericWindowManager';

export default class MainWindowManager extends GenericWindowManager {

  static instance: MainWindowManager;
  static FILEPATH = getUrlToLoad('main.html');

  constructor() {
    super();
    MainWindowManager.instance = this;
  }

  async create() {
    if (this.isCreated()) return this.window;

    await super.create({
      show: false,
      frame: !isDarwin,
      icon: getResourceIconPath(),
      acceptFirstMouse: true,
      savePosition: 'main-window',
    });

    await super.load();

    return this.window!;
  }

  // @overdide
  initDispatch() {
    MainWindowManager.dispatch(windowCreated(this.windowId, true));
  }
}
