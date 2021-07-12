import { LinksConfiguration } from '../types';
import { execScript } from '../utils';

const createBuildCommand = (config: LinksConfiguration) => async () => {
  await execScript(config.dependencyFolder, config.BUILD_SCRIPT);
};

export default createBuildCommand;
