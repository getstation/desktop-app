/* eslint-disable no-unused-vars */

export default {
  async up(query, DataTypes) {
    // Add `subdomain` and `identityId` column to `application`
    await query.addColumn('application', 'subdomain', DataTypes.STRING);
    await query.addColumn('application', 'identityId', DataTypes.STRING);
    // Fill `application`.`subdomain`
    await query.sequelize.query(`
      UPDATE application
      SET subdomain =
        (SELECT subdomain
         FROM "configData"
         WHERE configDataId = application.configDataId)
    `, { raw: true });
    // Fill `application`.`identityId`
    await query.sequelize.query(`
      UPDATE application
      SET identityId =
        (SELECT identityId
         FROM "configData"
         WHERE configDataId = application.configDataId)
    `, { raw: true });
    /*
    // Remove `configDataId` column from `application`
    await query.removeColumn('application', 'configDataId');
    // Delete `configData` table
    await query.dropTable('configData');
    */
  },

  async down(query, DataTypes) {
    /*
    // Create `configData` table
    query.createTable('configData', {
      configDataId: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      identityId: {
        type: DataTypes.STRING
      },
      subdomain: {
        type: DataTypes.STRING
      },
      applicationId: {
        type: DataTypes.STRING
      },
    });
    // Add `configDataId` column from `application`
    await query.addColumn('application', 'configDataId', DataTypes.INTEGER);
    */
    // Insert `configData` rows from `application`
    await query.sequelize.query(`
      INSERT INTO "configData" (identityId, subdomain, createdAt, updatedAt, applicationId)
      SELECT identityId, subdomain, date('now'), date('now'), applicationId
      FROM application
      WHERE identityId IS NOT NULL
      OR subdomain IS NOT NULL
    `, { raw: true });
    // Update `application`.`configDataId`
    await query.sequelize.query(`
      UPDATE application
      SET configDataId =
        (SELECT configDataId
         FROM "configData"
         WHERE applicationId = application.applicationId)
    `, { raw: true });
    // Remove `subdomain` and `identityId` column from `application`
    await query.removeColumn('application', 'subdomain');
    await query.removeColumn('application', 'identityId');
    // Remove temp `applicationId` column from `configData`
    await query.removeColumn('configData', 'applicationId');
  }
};
