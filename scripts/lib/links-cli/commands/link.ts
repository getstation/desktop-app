import { dirname, relative } from 'path';
import * as simplegit from 'simple-git/promise';

import { symlink, execScript, log, error, checkStatus } from '../utils';
import { LinksConfiguration } from '../types';

import createUnlinkCommand from './unlink';
import createBuildCommand from './build';

type SimpleGit = simplegit.SimpleGit;

const createLinkCommand = (config: LinksConfiguration) =>
  async (Git: SimpleGit, remote: string, givenBranchName: string | undefined) => {
    const buildCommand = createBuildCommand(config);
    const unlinkCommand = createUnlinkCommand(config);

    const currentBranch = (await Git.status()).current;
    const branch = givenBranchName || currentBranch;
    const shouldCheckout = branch !== currentBranch;

    if (shouldCheckout && !await checkStatus(Git)) {
      error('Error: you have unstaged changes on targeted repository.');
      return 1;
    }

    log(`Fetching ${remote}...`);
    await Git.fetch(remote);

    if (shouldCheckout) {
      log(`Checkout ${branch}`);
      await Git.checkout(branch);
    }

    const status = await Git.status();
    if (status.tracking && status.behind > 0) {
      try {
        await Git.rebase({ [status.tracking]: null });
        log(`Rebased ${status.tracking}`);
      } catch (e) {
        error('Error: rebase fails because conflicts, abort.');
        await Git.rebase({ '--abort': null });
        return 1;
      }
    }

    await unlinkCommand(true, false); // force: true, verbose: false

    const dependencyRelativeNodeModulesPath = relative(dirname(config.moduleFolder), config.dependencyFolder);
    await symlink(dependencyRelativeNodeModulesPath, config.moduleFolder);
    log(`Created symbolic link: "${config.moduleFolder}" -> "${dependencyRelativeNodeModulesPath}"`);

    await execScript(config.dependencyFolder, 'yarn link');
    await execScript(config.rootFolder, `yarn link ${config.PACKAGE_NAME}`);

    await execScript(config.dependencyFolder, config.POSTLINK_SCRIPT);
    await execScript(config.dependencyFolder, config.INSTALL_SCRIPT);
    await buildCommand();

    return 0;
  };

export default createLinkCommand;
