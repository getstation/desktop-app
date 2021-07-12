import * as Sequelize from 'sequelize';
import db from '../database/database';

export default db.define(
  'activity',
  {
    pluginId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    resourceId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    manifestURL: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    type: {
      type: Sequelize.STRING,
      defaultValue: '',
    },
    extraData: {
      type: Sequelize.STRING,
      defaultValue: '',
    },
  },
  {
    tableName: 'activity',
    indexes: [
      { fields: ['pluginId'] },
      { fields: ['resourceId'] },
      { fields: ['type'] },
    ],
  }
);
