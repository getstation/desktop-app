/* eslint-disable global-require */
const createTableUI = (query, DataTypes) => {
  const createUI = () => query.createTable('ui', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    isRightDockVisible: {
      type: DataTypes.BOOLEAN,
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
  return require('./201712061725-add-ui')
    .default
    .down(query)
    .then(createUI)
    .catch(createUI);
};

export default {
  up: createTableUI,
  down: (query) => query.dropTable('ui')
};
