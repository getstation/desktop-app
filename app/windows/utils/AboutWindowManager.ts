import { getUrlToLoad } from '../../utils/dev';
import { isDarwin } from '../../utils/process';
import GenericWindowManager from './GenericWindowManager';

class AboutWindowManager extends GenericWindowManager {
  static FILEPATH = getUrlToLoad('about.html');

  static async show() {
    await (new AboutWindowManager()).create();
  }

  async create() {
    if (this.isCreated()) return this.window;

    const params = {
      width: 550,
      height: 380,
      show: false,
      frame: !isDarwin,
      resizable: false,
    };

    await super.create(params);
    await super.load();

    return this.window!;
  }
}

export default AboutWindowManager;
