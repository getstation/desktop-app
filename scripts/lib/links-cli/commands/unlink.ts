import { LinksConfiguration } from '../types';
import { log, isSymlink, execScript, rimraf } from '../utils';

const createUnlinkCommand = (config: LinksConfiguration) => async (force?: boolean, verbose: boolean = true) => {
  if (force || (await isSymlink(config.moduleFolder))) {
    try {
      await execScript(config.rootFolder, `yarn unlink ${config.PACKAGE_NAME}`);
    } catch (e) {
      await rimraf(config.moduleFolder);
    }

    if (verbose) log(`Removed link node_modules/${config.PACKAGE_NAME}`);
    await execScript(config.dependencyFolder, config.POSTUNLINK_SCRIPT);
  } else {
    if (verbose) log(`Nothing to unlink`);
  }
};

export default createUnlinkCommand;
