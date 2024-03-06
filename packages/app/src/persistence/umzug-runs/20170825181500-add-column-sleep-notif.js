/* eslint-disable no-unused-vars */

export default {
  up(query, DataTypes) {
    query.addColumn('onboarding', 'sleepNotification', DataTypes.INTEGER);
  },

  down(query, DataTypes) {
    query.removeColumn('onboarding', 'sleepNotification');
  }
};
