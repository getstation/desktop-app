export const UNINSTALL_ALL_INSTANCES = 'browserX/abstract-applications/UNINSTALL_ALL_INSTANCES';
export type UNINSTALL_ALL_INSTANCES = typeof UNINSTALL_ALL_INSTANCES;

export type UninstallAllInstancesAction = {
  type: UNINSTALL_ALL_INSTANCES,
  manifestURL: string,
};

export type AbstractApplicationActions = UninstallAllInstancesAction;

export const uninstallAllInstances = (
  manifestURL: string
): UninstallAllInstancesAction => ({
  type: UNINSTALL_ALL_INSTANCES, manifestURL,
});
