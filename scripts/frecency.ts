import createLinksCli from './lib/links-cli';

createLinksCli({
  PACKAGE_NAME: '@getstation/frecency',
  PROJECT_RELATIVE_PATH: '../frecency',
  INSTALL_SCRIPT: 'npm install',
  BUILD_SCRIPT: 'npm run build',
});
