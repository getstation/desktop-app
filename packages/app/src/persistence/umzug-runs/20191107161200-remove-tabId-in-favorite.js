/* eslint-disable no-unused-vars */

export default {
  up(query, DataTypes) {
    return query.removeColumn('favorite', 'tabId', DataTypes.STRING);
  },

  down(query, DataTypes) {
    return query.addColumn('favorite', 'tabId', DataTypes.STRING);
  }
};
