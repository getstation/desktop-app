/* eslint-disable no-unused-vars */

export default {
  async up(query, DataTypes) {
    await query.createTable('activity', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      pluginId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resourceId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      extraData: {
        type: DataTypes.STRING,
        defaultValue: '',
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

    await query.addIndex('activity', { fields: ['pluginId'] });
    await query.addIndex('activity', { fields: ['resourceId'] });
    await query.addIndex('activity', { fields: ['type'] });
  },

  down(query, DataTypes) {
    return query.dropTable('activity');
  }
};
