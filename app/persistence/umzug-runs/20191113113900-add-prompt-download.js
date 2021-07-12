/* eslint-disable no-unused-vars */

export default {
  up(query, DataTypes) {
    return query.addColumn('app', 'promptDownload', DataTypes.BOOLEAN);
  },

  down(query, DataTypes) {
    return query.removeColumn('app', 'promptDownload');
  }
};
