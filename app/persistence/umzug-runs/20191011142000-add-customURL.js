/* eslint-disable no-unused-vars */

export default {
  async up(query, DataTypes) {
    await query.addColumn('application', 'customURL', DataTypes.STRING);
  },

  async down(query, DataTypes) {
    await query.removeColumn('application', 'customURL');
  }
};
