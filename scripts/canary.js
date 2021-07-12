const {
  equals,
  take,
  head,
  drop,
  prop,
  map,
  find,
} = require('ramda');
const { compact } = require('ramda-adjunct');
const moment = require('moment');
const GitHub = require('github-api');
const simplegit = require('simple-git/promise');
const program = require('commander');
const path = require('path');
const replace = require('replace-in-file');
const kuler = require('kuler');
const Slack = require('slack');
const { promisify } = require('util');
const fs = require('fs');
const mkdirp = promisify(require('mkdirp'));
const rimraf = promisify(require('rimraf'));

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const { GH_TOKEN, HATCHERY_SLACK_BOT_TOKEN } = process.env;

const shortenHash = take(7);

// eslint-disable-next-line no-console
const success = (x) => console.log(kuler(x, VALID_COLOR));
// eslint-disable-next-line no-console
const info = (x) => console.log(kuler(x, INFO_COLOR));
// eslint-disable-next-line no-console
const warn = (x) => console.warn(kuler(x, WARNING_COLOR));
// eslint-disable-next-line no-console
const error = (x) => console.error(kuler(x, ERROR_COLOR));
// eslint-disable-next-line no-console
const log = (...args) => console.log(...args);

const runProgram = (p) => {
  p.parse(process.argv);

  const getCmdName = prop('_name');
  const subCmd = find(getCmdName)(p.args);
  const cmds = map(getCmdName, p.commands);

  if (!cmds.includes(getCmdName(subCmd) || subCmd) && p.args.length > 0) {
    warn(`Unknown command: '${p.args.join(' ')}'`);
    process.exitCode = 1;
    p.help();
  }
};

const CACHE_FOLDER = '.cache';
const CANARY_FILE_CACHE = `${CACHE_FOLDER}/canary.json`;

const NOTIFICATION_CHANNEL = '#dev';
const BX_REPO = 'getstation/desktop-app';
const CANARY_REPO = 'getstation/station-canary';
const CANARY_RELEASE_URL = 'https://github.com/getstation/station-canary/releases';
const CANARY_LABEL = 'Ready for Canary';
const DEFAULT_REMOTE = 'origin';
const CANARY_BRANCH = 'canary-channel';
const MASTER_BRANCH = 'master';
const ELECTRON_BUILDER_CONFIG_FILE = './electron-builder-canary.yml';
const MERGE_COMMIT_MSG = 'chore: merge for canary';
const COMMIT_MSG = 'chore: bump canary version';
const DEV_SCRIPT_BRANCH = 'origin/infra/prepare-canary';

const WARNING_COLOR = '#F0A611';
const ERROR_COLOR = '#F00';
const INFO_COLOR = '#35B8F5';
const VALID_COLOR = '#26BF67';

const toJSON = (data) => JSON.stringify(data, null, 2);
const fromJSON = (json) => JSON.parse(json);

const writeCache = async (cache) => {
  const json = toJSON(cache);
  await mkdirp(CACHE_FOLDER);
  await writeFile(CANARY_FILE_CACHE, json);

  info(`written '${CANARY_FILE_CACHE}'`);
};

const readCache = async () => {
  try {
    const data = await readFile(CANARY_FILE_CACHE, 'utf8');
    const json = fromJSON(data);
    info(`readed '${CANARY_FILE_CACHE}'`);

    return json;
  } catch (e) {
    return null;
  }
};

const cleanCache = async () => {
  await rimraf(CANARY_FILE_CACHE);
  info(`=> rm -rf ${CANARY_FILE_CACHE}`);
};

const hatchery = new Slack({ token: HATCHERY_SLACK_BOT_TOKEN });

const postMessage = (text) => {
  return hatchery.chat.postMessage({ channel: NOTIFICATION_CHANNEL, text });
};

const checkSlackApi = () => {
  return hatchery.api.test().catch(e => {
    throw new Error(`${e.message} => Please check your HATCHERY_SLACK_BOT_TOKEN env variable`);
  });
};

const getReleaseUrl = (version) => `${CANARY_RELEASE_URL}/tag/${version}`;

if (!GH_TOKEN) {
  error('ERROR: unable to find `GH_TOKEN` environment variable');
  process.exit(1);
}

if (!HATCHERY_SLACK_BOT_TOKEN) {
  error('ERROR: unable to find `HATCHERY_SLACK_BOT_TOKEN` environment variable');
  process.exit(1);
}

const versionChecker = /^\d+(\.\d+){2}$/;

const ymlElectronBuilder = path.resolve(__dirname, '..', ELECTRON_BUILDER_CONFIG_FILE);
const replaceElectronBuilder = (releaseNumber) => {
  return replace({
    files: ymlElectronBuilder,
    from: /version: '*.*'/g,
    to: `version: '${releaseNumber}'`,
  });
};

const gh = new GitHub({
  token: process.env.GH_TOKEN,
});

const getEditDraftUrl = (url) => {
  const splittedUrl = url.split('/');
  splittedUrl[splittedUrl.length - 2] = 'edit';
  return splittedUrl.join('/');
};

const getPullRequests = async (bxRepo) => {
  const allPrs = (await bxRepo.listPullRequests()).data;

  const prs = allPrs.filter(pr => {
    return pr.labels.map(label => label.name).includes(CANARY_LABEL);
  });

  const allMasterPrs = prs.filter(pr => pr.base.ref === MASTER_BRANCH);
  const otherPrs = prs.filter(pr => pr.base.ref !== MASTER_BRANCH);

  const sortedPrs = [...allMasterPrs, ...otherPrs];

  return Promise.all(sortedPrs.map(async pr => {
    const commit = (await bxRepo.getCommit(pr.head.sha)).data;
    const lastCommitDate = commit.committer.date;
    return { ...pr, lastCommitDate };
  }));
};

const getLastCommitPr = (pr) =>
  `https://github.com/${BX_REPO}/pull/${pr.number}/commits/${pr.head.sha}`;

const formatForGithubRelease = (pr) => {
  const lastCommitDate = moment(pr.lastCommitDate).format();

  // eslint-disable-next-line max-len
  return `- [${pr.title}](${pr.html_url}) ([**${shortenHash(pr.head.sha)}**](${getLastCommitPr(pr)})) _${lastCommitDate}_`;
};

const formatForSlack = (pr) => {
  const lastCommitDate = moment(pr.lastCommitDate).calendar();
  return `- ${pr.title} (*${shortenHash(pr.head.sha)}*) _${lastCommitDate}_`;
};

const getPrsInformations = (prs, formater) => {
  const lines = prs.map(formater);
  return [
    ...lines,
    '',
    ':egg: :hatching_chick: :hatched_chick:',
  ].join('\n');
};

const getCanaryNotificationMessageOnCreate = (prsInformations, draftUrl, releaseNumber) => {
  return `:egg: *Station Canary v${releaseNumber}* _(new draft created)_

${prsInformations}

_draft:_ ${draftUrl}`;
};

const getCanaryNotificationMessageOnUpdate = (prsInformations, draftUrl, releaseNumber) => {
  return `:construction: *Station Canary v${releaseNumber}* _(updated draft)_

${prsInformations}

_draft:_ ${draftUrl}`;
};

const getRemote = async (git) => {
  const remotes = await git.getRemotes();
  if (!remotes || !remotes.length) {
    throw new Error('no git remote found');
  }

  return remotes.map(r => r.name).find(name => name === DEFAULT_REMOTE) || remotes[0].name;
};

const isBranchExist = async (git, branchName) => {
  if (!branchName) return false;
  const { branches } = await git.branch();
  return branches[branchName] || branches[`remotes/${branchName}`];
};

const formatBranch = (b) => `- ${b.prTitle} [${b.ref}]`;

const statusCommand = async (givenCache) => {
  try {
    const cache = givenCache || await readCache();
    const { conflicted, merged, toMerge } = cache.branches;

    const hasConflict = Boolean(conflicted);
    const hasNextMerge = toMerge.length > 0;

    log('Merged branches:');
    merged.forEach((b) => {
      success(formatBranch(b));
    });
    log('');

    log('Conflicted branch:');
    if (hasConflict) {
      warn(formatBranch(conflicted));
    }
    log('');

    log('Remaining branches:');
    toMerge.forEach((b) => {
      info(formatBranch(b));
    });
    log('');

    if (hasConflict) {
      warn('⚔️  Please fix conflicts and run `yarn canary continue`');
    } else if (!hasNextMerge) {
      success('👍  Successfully merged, run `yarn canary draft <version>` 🚀');
    }
  } catch (e) {
    info('no merge in progress: run "yarn canary merge" to start a new canary merge');
  }
};

const multiMerge = async (git, branches) => {
  if (!branches.length) return [];

  const [nextBranch, ...restBranches] = branches;

  try {
    info(`=> git merge ${nextBranch.ref}`);
    await git.merge([nextBranch.ref]);
    return multiMerge(git, restBranches);
  } catch (err) {
    const status = await git.status();
    if (status.files.length && !status.conflicted.length) {
      info(`=> git commit ${MERGE_COMMIT_MSG}`);
      await git.commit(MERGE_COMMIT_MSG);
      return multiMerge(git, restBranches);
    }
    return branches;
  }
};

const continueCommand = async (givenCache) => {
  const git = simplegit('.');
  const status = await git.status();
  if (status.current !== CANARY_BRANCH) {
    throw new Error(`you are not on '${CANARY_BRANCH}' branch`);
  }

  try {
    const cache = givenCache || await readCache();
    const { conflicted, toMerge, merged } = cache.branches;
    if (!conflicted && !toMerge.length) {
      success('👍  Successfully merged, run `yarn canary draft <version>` 🚀');
    } else {
      const branches = compact([conflicted, ...toMerge]);
      let nextCache = null;

      if (branches.length) {
        const toMergeBranches = await multiMerge(git, branches);
        const mergedBranches = branches.filter(b => !toMergeBranches.includes(b));
        const conflictedBranch = head(toMergeBranches) || null;

        nextCache = {
          ...cache,
          branches: {
            conflicted: conflictedBranch,
            merged: merged.concat(mergedBranches),
            toMerge: drop(1, toMergeBranches),
          },
        };

        if (conflictedBranch) {
          process.exitCode = 1;
        }
      } else {
        success('No merge needed');

        nextCache = {
          ...cache,
          branches: { conflicted: null, merged: [], toMerge: [] },
        };
      }

      await writeCache(nextCache);
      return statusCommand(nextCache);
    }
  } catch (e) {
    warn('no merge in progress: run "yarn canary merge" to start a new canary merge');
    process.exitCode = 1;
  }
};

const mergeCommand = async (options) => {
  const dryRun = Boolean(options.dry);
  const git = simplegit('.');
  const status = await git.status();
  const remote = await getRemote(git);

  if (status.files.length > 0) {
    throw new Error('your git status is not safe');
  }

  info(`Get '${BX_REPO}' PRs...`);
  const bx = await gh.getRepo(BX_REPO);
  const prs = await getPullRequests(bx);

  info('=> git fetch');
  await git.fetch();

  const devScriptBranchExist = await isBranchExist(git, DEV_SCRIPT_BRANCH);

  if (!devScriptBranchExist) {
    warn(`Branch '${DEV_SCRIPT_BRANCH}' does not exists`);
  }

  const branches = compact([
    devScriptBranchExist ? { ref: DEV_SCRIPT_BRANCH, prTitle: '[TMP] INFRA: prepare canary' }
      : undefined,
    ...prs.map(pr => ({
      ref: `${remote}/${pr.head.ref}`,
      prTitle: pr.title,
    })),
  ]);

  info(`=> git checkout ${CANARY_BRANCH}`);
  await git.checkout(CANARY_BRANCH);


  info(`=> git reset --hard ${remote}/${MASTER_BRANCH}`);
  await git.reset(['--hard', `${remote}/${MASTER_BRANCH}`]);

  const cache = {
    prs,
    branches: { conflicted: null, merged: [], toMerge: branches },
  };

  if (!dryRun) {
    const notificationMessage = ':egg: _Someone is merging a canary..._ :canary:';
    await postMessage(notificationMessage);
    success(`stationworld.slack.com: '${NOTIFICATION_CHANNEL}' notified`);
  }

  return continueCommand(cache);
};

const abortCommand = async () => {
  const git = simplegit('.');
  const status = await git.status();
  if (status.current !== CANARY_BRANCH) {
    throw new Error(`you are not on '${CANARY_BRANCH}' branch`);
  }

  try {
    await readCache();
  } catch (e) {
    warn('no merge in progress: run "yarn canary merge" to start a new canary merge');
    process.exitCode = 1;
  }

  const remote = await getRemote(git);
  const ref = `${remote}/${CANARY_BRANCH}`;

  info(`=> git reset --hard ${ref}`);
  await git.reset(['--hard', ref]);

  info('=> git checkout -');
  await git.checkout('-');

  await cleanCache();
};

const draftCommand = async (releaseNumber, dryRun) => {
  const git = simplegit('.');
  const status = await git.status();

  if (status.files.length > 0) {
    throw new Error('your git status is not safe');
  }

  const isVersionFormated = versionChecker.test(releaseNumber);

  if (!releaseNumber || !isVersionFormated) {
    throw new Error(`You did not provide a release number or is not valid for your canary😳, sent: ${releaseNumber}`);
  }

  if (status.current !== CANARY_BRANCH) {
    throw new Error(`you are not on '${CANARY_BRANCH}' branch`);
  }

  if (!dryRun) {
    info('Check slack api...');
    await checkSlackApi(); // will throw in case of token issues
  }

  try {
    const cache = await readCache();
    const prs = cache.prs || [];

    info(`Get '${CANARY_REPO}' releases`);
    const stationCanary = await gh.getRepo(CANARY_REPO);

    const prsInformations = getPrsInformations(prs, formatForGithubRelease);
    const slackPrsInformations = getPrsInformations(prs, formatForSlack);

    const allReleases = (await stationCanary.listReleases()).data;
    const drafts = allReleases.filter(r => r.draft);
    const releases = allReleases.filter(r => !r.draft);

    const release = releases.find(r => r.tag_name === releaseNumber);

    if (release) {
      error(`StationCanary v${releaseNumber} is already released`);
      process.exitCode = 1;
      return;
    }

    const matchedDraft = drafts.find(draft => draft.tag_name === releaseNumber);

    if (!dryRun && !matchedDraft) { // create draft
      const res = (await stationCanary.createRelease({
        tag_name: releaseNumber,
        target_commitish: MASTER_BRANCH,
        name: releaseNumber,
        body: prsInformations,
        draft: true,
        prerelease: false,
      })).data;

      success(`draft for '${releaseNumber}' created: ${getReleaseUrl(releaseNumber)}`);

      await postMessage(getCanaryNotificationMessageOnCreate(slackPrsInformations, res.html_url, releaseNumber));

      success(`stationworld.slack.com: '${NOTIFICATION_CHANNEL}' notified`);
    } else if (!dryRun) { // update draft
      info(`draft for '${releaseNumber} 'found`);

      if (matchedDraft.assets.length > 0) {
        error(`draft '${releaseNumber}' has already assets.
        please remove them: '${getEditDraftUrl(matchedDraft.html_url)}'`);
        process.exitCode = 1;
        return;
      }

      if (!equals(prsInformations, matchedDraft.body)) {
        const res = (await stationCanary.updateRelease(matchedDraft.id, {
          body: prsInformations,
          tag_name: releaseNumber,
        })).data;
        success(`draft for '${releaseNumber}' updated: ${getReleaseUrl(releaseNumber)}`);

        await postMessage(getCanaryNotificationMessageOnUpdate(slackPrsInformations, res.html_url, releaseNumber));
        success(`stationworld.slack.com: '${NOTIFICATION_CHANNEL}' notified`);
      }
    }

    await replaceElectronBuilder(releaseNumber);
    success(`Version changed in ${ymlElectronBuilder}`);

    await git.commit(COMMIT_MSG, [ELECTRON_BUILDER_CONFIG_FILE], { '--allow-empty': true });
    info(`=> git add ${ELECTRON_BUILDER_CONFIG_FILE}`);
    info(`=> git commit -m '${COMMIT_MSG}'`);

    await cleanCache();
  } catch (e) {
    error(e);
    warn('no merge in progress: run "yarn canary merge" to start a new canary merge');
    process.exitCode = 1;
  }
};

program.version('0.2.0');

program
  .command('merge')
  .description('start a new canary merge')
  .option('--dry', 'do not notify slack')
  .action((args, options) => mergeCommand(args, options).catch(error));

program
  .command('continue')
  .description('continue a merge (should be called after each conflict resolution)')
  .action(() => continueCommand().catch(error));

program
  .command('draft <version>') // release version is require by <> syntax
  .description('create a github draft for canary')
  .option('--dry', 'do not create github draft and do not notify slack')
  .action((version, options) => draftCommand(version, Boolean(options.dry)).catch(error));

program
  .command('abort')
  .description('abort a merge')
  .action(() => abortCommand().catch(error));

program
  .command('status')
  .description('display canary status information')
  .action(() => statusCommand().catch(error));

runProgram(program);
