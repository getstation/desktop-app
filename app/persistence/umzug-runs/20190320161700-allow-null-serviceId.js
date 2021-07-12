/* eslint-disable no-unused-vars */

export default {
  async up(query, DataTypes) {
    await query.changeColumn('applicationSettings', 'serviceId', {
      type: DataTypes.STRING,
      primaryKey: false,
      allowNull: true,
    });
  },

  async down(query, DataTypes) {
    await query.changeColumn('applicationSettings', 'serviceId', {
      type: DataTypes.STRING,
      primaryKey: false,
      allowNull: false,
    });
  }
};
