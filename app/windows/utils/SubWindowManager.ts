import { attach } from '../../subwindows/duck';
import { closeAfterReattachedOrTimeout } from '../../tab-webcontents/duck';
import { getUrlToLoad } from '../../utils/dev';
import { isDarwin } from '../../utils/process';
import { updateTabId } from '../duck';
import GenericWindowManager from './GenericWindowManager';
import MainWindowManager from './MainWindowManager';

export default class SubWindowManager extends GenericWindowManager {

  public static subwindows = new Map<string, SubWindowManager>();
  public static FILEPATH = getUrlToLoad('sub.html');

  public tabId: string;

  constructor(tabId: string) {
    super();
    this.tabId = tabId;
    SubWindowManager.subwindows.set(tabId, this);
    this.initHandlers();
  }

  static async new(tabId: string) {
    const subwin = new this(tabId);
    const win = await subwin.create(true);
    SubWindowManager.dispatch(updateTabId(await win.getId(), tabId));
  }

  static async hideAndCloseAfterReattach(tabId: string) {
    const win = SubWindowManager.subwindows.get(tabId);
    if (win) {
      await win.hide();
      SubWindowManager.dispatch(closeAfterReattachedOrTimeout(tabId));
    }
  }

  static async close(tabId: string) {
    const win = SubWindowManager.subwindows.get(tabId);
    if (win) {
      await win.close();
    }
  }

  static async getBounds(dockWidth: number = 50, translateX: number = 20, translateY: number = 20) {
    const mainWin = MainWindowManager.instance && MainWindowManager.instance.window;
    if (!mainWin) return {};
    const bounds = await mainWin.getBounds();
    bounds.x += dockWidth + translateX;
    bounds.y += translateY;
    bounds.width -= dockWidth;
    return bounds;
  }

  initHandlers() {
    this.on('closed', () => {
      SubWindowManager.dispatch(attach(this.tabId));
      SubWindowManager.subwindows.delete(this.tabId);
    });
  }

  async create(...args: any[]) {
    if (this.isCreated()) return this.window;

    await super.create({
      show: false,
      frame: !isDarwin,
      acceptFirstMouse: true,
      ...await SubWindowManager.getBounds(),
    }, ...args);

    await this.window!.setMetadata({
      subData: {
        tabId: this.tabId,
      },
    });

    await super.load();

    return this.window!;
  }
}
