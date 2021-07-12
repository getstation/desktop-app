/* eslint-disable no-unused-vars */

export default {
  up(query, DataTypes) {
    return query.addColumn('services', 'instanceLogoInDock', DataTypes.BOOLEAN);
  },

  down(query, DataTypes) {
    return query.removeColumn('services', 'instanceLogoInDock');
  }
};
