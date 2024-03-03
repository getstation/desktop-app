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
        manifestURL VARCHAR(255)
      )
    `, { transaction });

  const { mapping } = require('../migration-data/service-id-to-manifest-url.json');
  sequelize.query(`
      INSERT INTO ServiceApplicationIdMapping (serviceId, manifestURL)
      VALUES ${mapping.map(m => `("${m.serviceId}", "${m.manifestURL}")`).join(', \n')};
    `, { transaction });

  // Activity
  sequelize.query(`
      UPDATE activity
      SET manifestURL = (
        SELECT manifestURL
        FROM ServiceApplicationIdMapping
        WHERE serviceId = activity.serviceId
      )
      WHERE EXISTS (
        SELECT manifestURL
        FROM ServiceApplicationIdMapping
        WHERE serviceId = activity.serviceId
      );
    `, { transaction });

  // servicesData
  sequelize.query(`
      UPDATE servicesData
      SET manifestURL = (
        SELECT manifestURL
        FROM ServiceApplicationIdMapping
        WHERE serviceId = servicesData.serviceId
      )
      WHERE EXISTS (
        SELECT manifestURL
        FROM ServiceApplicationIdMapping
        WHERE serviceId = servicesData.serviceId
      );
    `, { transaction });

  await transaction.commit();
}

export default {
  async up(query, DataTypes) {
    await query.addColumn('activity', 'manifestURL', DataTypes.STRING);
    await query.addColumn('servicesData', 'manifestURL', DataTypes.STRING);

    const { sequelize } = query;
    await migrateData(sequelize);
    await query.changeColumn('servicesData', 'serviceId', {
      type: DataTypes.STRING,
      primaryKey: false,
      allowNull: true,
    });
  },

  async down(query, DataTypes) {
    await query.removeColumn('activity', 'manifestURL');
    await query.removeColumn('servicesData', 'manifestURL');
  }
};
