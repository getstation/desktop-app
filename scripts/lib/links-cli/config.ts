import { basename, join, resolve } from 'path';
import { LinksConfiguration, LinksUserConfiguration } from './types';

export const VERSION = '0.3.0';
export const LOCALE = 'us_US';

export const getLinksConfiguration = (userConfig: LinksUserConfiguration): LinksConfiguration => {
  const rootFolder = resolve(__dirname, '../../..');
  const projectName = basename(userConfig.PROJECT_RELATIVE_PATH);
  const moduleFolder = join(rootFolder, 'node_modules', userConfig.PACKAGE_NAME);
  const dependencyFolder = resolve(rootFolder, userConfig.PROJECT_RELATIVE_PATH);
  const BUILD_SCRIPT = userConfig.BUILD_SCRIPT || '';
  const POSTLINK_SCRIPT = userConfig.POSTLINK_SCRIPT || '';
  const POSTUNLINK_SCRIPT = userConfig.POSTUNLINK_SCRIPT || '';
  const INSTALL_SCRIPT = userConfig.INSTALL_SCRIPT || 'yarn install';
  return {
    ...userConfig,
    BUILD_SCRIPT,
    INSTALL_SCRIPT,
    POSTLINK_SCRIPT,
    POSTUNLINK_SCRIPT,
    rootFolder,
    projectName,
    moduleFolder,
    dependencyFolder,
  };
};
