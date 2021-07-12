export default {
  up: (query, DataTypes) =>
    query.addColumn('onboarding', 'appInstallationLimitUnlocked', DataTypes.BOOLEAN),
  down: (query) =>
    query.removeColumn('onboarding', 'appInstallationLimitUnlocked'),
};
