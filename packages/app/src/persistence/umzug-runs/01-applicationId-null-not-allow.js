/* eslint-disable no-unused-vars */

export default {
  up: (query, DataTypes) => query
    .bulkDelete('application', { applicationId: null })
    .then(() =>
      query.changeColumn('application', 'applicationId', {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      })),
  down: (query, DataTypes) =>
    query.changeColumn('application', 'applicationId', {
      type: DataTypes.STRING,
      primaryKey: true,
    })
};
