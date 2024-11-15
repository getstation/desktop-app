/* eslint-disable no-unused-vars */

export default {
  up(query, DataTypes) {
    return query.addColumn('app', 'minimizeToTray', DataTypes.BOOLEAN);
  },

  down(query, DataTypes) {
    return query.removeColumn('app', 'minimizeToTray');
  }
};
