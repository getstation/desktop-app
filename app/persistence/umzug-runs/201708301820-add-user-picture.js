export default {
  up: (query, DataTypes) =>
    query.addColumn('user', 'picture', DataTypes.STRING),
  down: (query) =>
    query.removeColumn('user', 'picture'),
};
