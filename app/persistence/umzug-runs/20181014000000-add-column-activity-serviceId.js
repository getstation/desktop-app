/* eslint-disable no-unused-vars */

export default {
  up(query, DataTypes) {
    return query.addColumn('activity', 'serviceId', DataTypes.STRING);
  },

  down(query, DataTypes) {
    return query.removeColumn('activity', 'serviceId');
  }
};
