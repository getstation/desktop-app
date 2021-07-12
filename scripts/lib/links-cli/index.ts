import * as simplegit from 'simple-git/promise';
import * as Yargs from 'yargs';

import { getLinksConfiguration, VERSION, LOCALE } from './config';
import { execCli } from './utils';
import { LinksUserConfiguration } from './types';

import createLinkCommand from './commands/link';
import createUnlinkCommand from './commands/unlink';
import createBuildCommand from './commands/build';

type Argv = Yargs.Argv;
type Arguments = Yargs.Arguments;

const createLinksCli = (userConfig: LinksUserConfiguration): Arguments => {
  const config = getLinksConfiguration(userConfig);
  const { projectName, dependencyFolder } = config;
  const buildCommand = createBuildCommand(config);
  const unlinkCommand = createUnlinkCommand(config);
  const linkCommand = createLinkCommand(config);
  return Yargs
    .strict()
    .scriptName(projectName)
    .version(VERSION)
    .locale(LOCALE)
    .demandCommand(1)
    .example(`$0 link --help`, 'display usage for this command')
    .command('link [branch]', `Link a ${projectName} branch`, (yargs: Argv) => (
      yargs
        .usage('$0 link [--remote <remote>] [branch]')
        .option('remote', {
          type: 'string',
          description: 'Use a different remote (git)',
          default: 'origin',
        })
        .positional('branch', {
          type: 'string',
          description: 'branch name to checkout',
        })
    ), (argv) => {
      return execCli(linkCommand(simplegit(dependencyFolder), argv.remote, argv.branch));
    })
    .command('unlink', `Unlink current ${projectName} branch`, (yargs: Argv) => (
      yargs.usage('$0 unlink')
    ), () => {
      return execCli(unlinkCommand());
    })
    .command('build', `Build ${projectName}`, (yargs: Argv) => (
      yargs.usage('$0 build')
    ), () => {
      return execCli(buildCommand());
    })
    .argv;
};

export default createLinksCli;
