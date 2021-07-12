import createLinksCli from './lib/links-cli';

createLinksCli({
  PACKAGE_NAME: '@getstation/sdk',
  PROJECT_RELATIVE_PATH: '../sdk',
  BUILD_SCRIPT: 'yarn build',
  INSTALL_SCRIPT: 'yarn install',
});
