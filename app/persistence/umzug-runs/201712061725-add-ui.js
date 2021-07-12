const createTableUI = (query, DataTypes) =>
  query.createTable('ui', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    rightDockSize: {
      type: DataTypes.INTEGER,
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

export default {
  up: createTableUI,
  down: (query) => query.dropTable('ui')
};
