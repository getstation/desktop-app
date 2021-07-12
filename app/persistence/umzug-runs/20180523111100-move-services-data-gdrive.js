/* eslint-disable no-unused-vars */

export default {
  async up(query, DataTypes) {
    await query.sequelize.query(`
      UPDATE "servicesData"
      SET serviceId = 'gdrive-mu'
      WHERE serviceId = 'gdrive'
    `, { raw: true });
  },

  async down(query, DataTypes) {
    await query.sequelize.query(`
      UPDATE "servicesData"
      SET serviceId = 'gdrive'
      WHERE serviceId = 'gdrive-mu'
    `, { raw: true });
  }
};
