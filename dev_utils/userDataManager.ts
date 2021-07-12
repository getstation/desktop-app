import { copySync, readdirSync } from 'fs-extra';
import * as inquirer from 'inquirer';
import { homedir } from 'os';
import { basename, dirname, resolve } from 'path';
import * as rimraf from 'rimraf';
import * as yargs from 'yargs';

const homeDir = homedir();
const applicationSupportPath = resolve(homeDir, 'Library/Application Support');
const envs = [
  {
    name: 'Dev',
    path: resolve(applicationSupportPath, 'Station Dev'),
    regex: /^Station Dev/,
  },
  {
    name: 'Prod',
    path: resolve(applicationSupportPath, 'Stationv2'),
    regex: /^Stationv2/,
  },
];

const resolveEnvFilepath = (env: NonNullable<ReturnType<typeof getEnv>>) => {
  return resolve(dirname(env.path), env.filename);
};

const isBasePath = (env: NonNullable<ReturnType<typeof getEnv>>) => {
  return envs.map(e => e.path).includes(resolveEnvFilepath(env));
};

const argv = yargs
  .command('backup', 'Backup an env')
  .command('restore', 'Restore an env')
  .command('clean', 'Clean multiple envs')
  .argv;

const getEnv = (filename: string) => {
  for (const env of envs) {
    const matches = filename.match(env.regex);
    if (matches === null) continue;

    return {
      ...env,
      filename,
    };
  }
  return null;
};

type Env = {
  name: string,
  value: ReturnType<typeof getEnv>,
  short: string,
};

function* listDefaultEnvs(): IterableIterator<Env> {
  for (const env of envs) {
    yield {
      name: basename(env.path),
      value: {
        ...env,
        filename: basename(env.path),
      },
      short: basename(env.path),
    };
  }
}

function* listEnvs(): IterableIterator<Env> {
  for (const file of readdirSync(applicationSupportPath)) {
    const env = getEnv(file);
    if (env) {
      yield {
        name: env.filename,
        value: env,
        short: env.filename,
      };
    }
  }
}

function* listNonDefaultEnvs(): IterableIterator<Env> {
  for (const env of listEnvs()) {
    if (!env.value || isBasePath(env.value)) continue;
    yield env;
  }
}

switch (argv._[0]) {
  case 'restore':
    inquirer.prompt({
      type: 'list',
      name: 'restore',
      message: 'Choose the one you want to restore',
      choices: Array.from(listNonDefaultEnvs()),
    }).then(async ({ restore }: { restore: ReturnType<typeof getEnv> }) => {
      if (restore === null) return;
      const destinationFilename = basename(restore.path);
      const sourcePath = resolveEnvFilepath(restore);

      const { confirm } = await inquirer.prompt({
        type: 'confirm',
        name: 'confirm',
        message: `Overwrite "${destinationFilename}" with "${restore.filename}"`,
        default: false,
      });

      if (confirm) {
        copySync(sourcePath, restore.path);
      }
    });
    break;
  case 'backup':
    inquirer.prompt({
      type: 'list',
      name: 'backup',
      message: 'Choose the one you want to backup',
      choices: Array.from(listDefaultEnvs()),
    }).then(async ({ backup }: { backup: ReturnType<typeof getEnv> }) => {
      if (backup === null) return;
      const parentDir = dirname(backup.path);
      const date = new Date();
      const newDirName = `${basename(backup.path)}.${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.` +
        `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
      const newDirPath = resolve(parentDir, newDirName);

      copySync(backup.path, newDirPath);

      console.log(`"${newDirName}" created.`);
    });
    break;
  case 'clean':
    inquirer.prompt({
      type: 'checkbox',
      name: 'clean',
      message: 'Choose the ones you want to delete',
      choices: Array.from(listEnvs()),
    }).then(async ({ clean }: { clean: ReturnType<typeof getEnv>[] }) => {
      for (const env of clean) {
        if (env === null) continue;
        rimraf.sync(resolveEnvFilepath(env));
        console.log(`"${env.filename}" deleted.`);
      }
    });
    break;
  default:
    yargs.showHelp();
}
