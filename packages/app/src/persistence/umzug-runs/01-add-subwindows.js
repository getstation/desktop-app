/* eslint-disable no-unused-vars */

export default {
  up: (query, DataTypes) => query.createTable('subwindow', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    tabId: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }),
  down: (query, DataTypes) => {
    return query.dropTable('subwindow');
  },
};
