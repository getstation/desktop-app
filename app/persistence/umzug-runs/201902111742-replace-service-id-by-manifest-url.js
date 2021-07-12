/* eslint-disable no-unused-vars */

async function migrateData(sequelize) {
  // we'll update the manifesURL columns based on serviceId
  // and the mapping in the file `migration-data/service-id-to-manifest-url.json`

  // SQL-wise it is made by creating a temporary mapping table from
  // the mapping file and excecute an UPDATE query using this table

  const transaction = await sequelize.transaction();

  sequelize.query(`
  DROP TABLE IF EXISTS ServiceManifestMapping
  `, { transaction });

  sequelize.query(`
  CREATE TEMPORARY TABLE ServiceManifestMapping (
      serviceId VARCHAR(255),
      manifestURL VARCHAR(255)
    )
  `, { transaction });

  const { mapping } = require('../migration-data/service-id-to-manifest-url.json');
  sequelize.query(`
    INSERT INTO ServiceManifestMapping (serviceId, manifestURL)
    VALUES ${mapping.map(m => `("${m.serviceId}", "${m.manifestURL}")`).join(', \n')};
  `, { transaction });


  sequelize.query(`
    UPDATE application
    SET manifestURL = (
      SELECT manifestURL
      FROM ServiceManifestMapping
      WHERE serviceId = application.serviceId
    )
    WHERE EXISTS (
      SELECT manifestURL
      FROM ServiceManifestMapping
      WHERE serviceId = application.serviceId
    );
  `, { transaction });

  sequelize.query(`
    UPDATE applicationSettings
    SET manifestURL = (
      SELECT manifestURL
      FROM ServiceManifestMapping
      WHERE serviceId = applicationSettings.serviceId
    )
    WHERE EXISTS (
      SELECT manifestURL
      FROM ServiceManifestMapping
      WHERE serviceId = applicationSettings.serviceId
    );
  `, { transaction });

  await transaction.commit();
}

// todo(app-323) remove the serviceId column from applicationSettings and application
// in a new migration

export default {
  async up(query, DataTypes) {
    await query.addColumn('application', 'manifestURL', DataTypes.STRING);

    await query.renameTable('services', 'applicationSettings', DataTypes.STRING);
    await query.addColumn('applicationSettings', 'manifestURL', DataTypes.STRING);

    const { sequelize } = query;
    await migrateData(sequelize);
  },

  async down(query, DataTypes) {
    await query.removeColumn('applicationSettings', 'manifestURL');
    await query.renameTable('applicationSettings', 'services', DataTypes.STRING);

    await query.removeColumn('application', 'manifestURL');
  }
};
