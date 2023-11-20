/* eslint-disable no-unused-vars */

export default {
  up(query, DataTypes) {
    query.addColumn('onboarding', 'appStoreTooltipDisabled', DataTypes.BOOLEAN);
  },

  down(query, DataTypes) {
    query.removeColumn('onboarding', 'appStoreTooltipDisabled');
  }
};
