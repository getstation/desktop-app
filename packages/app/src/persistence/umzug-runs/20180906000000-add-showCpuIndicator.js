/* eslint-disable no-unused-vars */

export default {
  up(query, DataTypes) {
    return query.addColumn('app', 'showCpuIndicator', DataTypes.BOOLEAN);
  },

  down(query, DataTypes) {
    return query.removeColumn('app', 'showCpuIndicator');
  }
};
