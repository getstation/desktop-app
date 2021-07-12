/* eslint-disable no-unused-vars */

export default {
  up(query, DataTypes) {
    return query.addColumn('app', 'downloadFolder', DataTypes.STRING);
  },

  down(query, DataTypes) {
    return query.removeColumn('app', 'downloadFolder');
  }
};
