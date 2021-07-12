import { execSync } from 'child_process';
import * as fs from 'fs';
import * as rimrafCallback from 'rimraf';
import * as simplegit from 'simple-git/promise';
import { promisify } from 'util';

type SimpleGit = simplegit.SimpleGit;
type StatusResult = simplegit.StatusResult;

export const execScript = (cwd: string, shellscript: string) => {
  if (shellscript) {
    return execSync(shellscript, { stdio: [0, 1, 2], cwd });
  }
  return false;
};

export const log = (x: any) => console.log(x);
export const error = (x: any) => console.error(x);

export const checkStatus = (Git: SimpleGit) => Git.status().then((status: StatusResult) => status.files.length === 0);

export const execCli = (mainP: Promise<number | undefined | void>) => {
  return mainP
    .then((exitCode = 0) => process.exit(exitCode))
    .catch((err) => {
      const code = err && err.code;
      process.exit(code || 1);
    });
};

const lstat = promisify(fs.lstat);

export const symlink = promisify(fs.symlink);

export const isSymlink = async (path: string) => {
  try {
    return (await lstat(path)).isSymbolicLink();
  } catch (e) {
    return false;
  }
};

export const rimraf = promisify(rimrafCallback);
