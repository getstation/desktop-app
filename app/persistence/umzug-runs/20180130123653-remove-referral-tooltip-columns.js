/* eslint-disable no-unused-vars */

export default {
  async up(query, DataTypes) {
    await query.removeColumn('onboarding', 'referralTooltipShownAt', DataTypes.INTEGER);
    await query.removeColumn('onboarding', 'referralTooltipReminder1ShownAt', DataTypes.INTEGER);
    return await query.removeColumn('onboarding', 'referralTooltipReminder2ShownAt', DataTypes.INTEGER);
  },
  async down(query, DataTypes) {
    await query.addColumn('onboarding', 'referralTooltipShownAt', DataTypes.INTEGER);
    await query.addColumn('onboarding', 'referralTooltipReminder1ShownAt', DataTypes.INTEGER);
    return await query.addColumn('onboarding', 'referralTooltipReminder2ShownAt', DataTypes.INTEGER);
  }
};
