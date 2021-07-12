/* eslint-disable no-unused-vars */

async function migrateData(sequelize) {
  // we'll update the installContext columns based on serviceId
  // and the mapping in the file `migration-data/service-id-to-manifest-url.json`

  // SQL-wise it is made by creating a temporary mapping table from
  // the mapping file and excecute an UPDATE query using this table

  const transaction = await sequelize.transaction();

  sequelize.query(`
    DROP TABLE IF EXISTS ServiceApplicationIdMapping
    `, { transaction });

  sequelize.query(`
    CREATE TEMPORARY TABLE ServiceApplicationIdMapping (
        serviceId VARCHAR(255),
        applicationId VARCHAR(255)
      )
    `, { transaction });

  const { mapping } = require('../migration-data/service-id-to-manifest-url.json');
  sequelize.query(`
      INSERT INTO ServiceApplicationIdMapping (serviceId, applicationId)
      VALUES ${mapping.map(m => `("${m.serviceId}", "${m.appStoreApplicationId}")`).join(', \n')};
    `, { transaction });

  // create a JSON by concatenation to obtain something like {"id":"recipe/23","platform":"appstore"}

  sequelize.query(`
      UPDATE application
      SET installContext = '{"id":"' || (
        SELECT applicationId
        FROM ServiceApplicationIdMapping
        WHERE serviceId = application.serviceId
      ) || '","platform":"appstore"}'
      WHERE EXISTS (
        SELECT applicationId
        FROM ServiceApplicationIdMapping
        WHERE serviceId = application.serviceId
      );
    `, { transaction });

  await transaction.commit();
}

export default {
  async up(query, DataTypes) {
    await query.addColumn('application', 'installContext', DataTypes.STRING);

    const { sequelize } = query;
    await migrateData(sequelize);
  },

  down(query, DataTypes) {
    return query.removeColumn('application', 'installContext');
  }
};
