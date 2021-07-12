/* eslint-disable no-unused-vars */

export default {
  up(query, DataTypes) {
    return query.addColumn('application', 'notificationsEnabled', DataTypes.BOOLEAN);
  },

  down(query, DataTypes) {
    return query.removeColumn('application', 'notificationsEnabled');
  }
};
