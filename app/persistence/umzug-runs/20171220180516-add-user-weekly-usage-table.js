/* eslint-disable no-unused-vars */

export default {
  async up(query, DataTypes) {
    await query.createTable('userWeeklyUsage', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      timestamp: {
        type: DataTypes.INTEGER
      },
      order: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    await query.addColumn('onboarding', 'referralTooltipShownAt', DataTypes.INTEGER);
    await query.addColumn('onboarding', 'referralTooltipReminder1ShownAt', DataTypes.INTEGER);
    await query.addColumn('onboarding', 'referralTooltipReminder2ShownAt', DataTypes.INTEGER);
    return await query.addColumn('onboarding', 'lastInvitationColleagueDate', DataTypes.INTEGER);
  },

  async down(query, DataTypes) {
    await query.dropTable('userWeeklyUsage');

    await query.removeColumn('onboarding', 'referralTooltipShownAt', DataTypes.INTEGER);
    await query.removeColumn('onboarding', 'referralTooltipReminder1ShownAt', DataTypes.INTEGER);
    await query.removeColumn('onboarding', 'referralTooltipReminder2ShownAt', DataTypes.INTEGER);
    return await query.removeColumn('onboarding', 'lastInvitationColleagueDate', DataTypes.INTEGER);
  }
};
