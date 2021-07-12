
export type LinksUserConfiguration = {
  PACKAGE_NAME: string,
  PROJECT_RELATIVE_PATH: string,
  BUILD_SCRIPT?: string,
  INSTALL_SCRIPT?: string,
  POSTLINK_SCRIPT?: string;
  POSTUNLINK_SCRIPT?: string,
};

export type LinksConfiguration = LinksUserConfiguration & {
  BUILD_SCRIPT: string,
  INSTALL_SCRIPT: string,
  POSTLINK_SCRIPT: string;
  POSTUNLINK_SCRIPT: string,
  rootFolder: string,
  projectName: string,
  moduleFolder: string,
  dependencyFolder: string,
};
