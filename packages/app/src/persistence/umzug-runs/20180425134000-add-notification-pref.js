/* eslint-disable no-unused-vars */

export default {
  async up(query, DataTypes) {
    await query.sequelize.query(`
      DELETE FROM "dock"
      WHERE id NOT IN
        (SELECT min(id)
         FROM dock
         GROUP BY applicationId);
    `, { raw: true });
  },

  async down(query, DataTypes) {
    return null;
  }
};
