import createLinksCli from './lib/links-cli';

createLinksCli({
  PACKAGE_NAME: '@getstation/theme',
  PROJECT_RELATIVE_PATH: '../theme',
  BUILD_SCRIPT: 'yarn build',
  INSTALL_SCRIPT: 'yarn install',
});
