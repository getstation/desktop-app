/* eslint-disable no-unused-vars */

export default {
  up(query, DataTypes) {
    return query.addColumn('app', 'currentWorkspaceId', DataTypes.STRING);
  },

  down(query, DataTypes) {
    return query.removeColumn('app', 'currentWorkspaceId');
  }
};
