/* eslint-disable no-unused-vars */

export default {
  async up(query, DataTypes) {
    await query.addColumn('tab', 'lastActivityAt', DataTypes.INTEGER);
    await query.sequelize.query(`
      UPDATE "tab"
      SET lastActivityAt = updatedAt
    `, { raw: true });
  },

  async down(query) {
    await query.removeColumn('tab', 'lastActivityAt');
  }
};
