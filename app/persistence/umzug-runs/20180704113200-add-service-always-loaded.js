/* eslint-disable no-unused-vars */

export default {
  up(query, DataTypes) {
    return query.addColumn('services', 'alwaysLoaded', DataTypes.BOOLEAN);
  },

  down(query, DataTypes) {
    return query.removeColumn('services', 'alwaysLoaded');
  }
};
