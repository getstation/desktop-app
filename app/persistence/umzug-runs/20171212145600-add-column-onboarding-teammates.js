/* eslint-disable no-unused-vars */

export default {
  up(query, DataTypes) {
    return query.addColumn('onboarding', 'rightDockTooltipDisabled', DataTypes.BOOLEAN);
  },

  down(query, DataTypes) {
    return query.removeColumn('onboarding', 'rightDockTooltipDisabled');
  }
};
