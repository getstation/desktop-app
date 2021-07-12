/* eslint-disable no-unused-vars */

export default {
  async up(query, DataTypes) {
    await query.createTable('services', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      serviceId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      doNotInstall: {
        type: DataTypes.BOOLEAN,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
    });
  },

  down(query, DataTypes) {
    return query.dropTable('services');
  }
};
