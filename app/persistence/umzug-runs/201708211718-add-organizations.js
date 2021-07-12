/* eslint-disable no-unused-vars */

const createTableOrganization = (query, DataTypes) =>
  query.createTable('organization', {
    organizationId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING
    },
    slug: {
      type: DataTypes.STRING
    },
    pictureUrl: {
      type: DataTypes.STRING
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

const recreateAuthOrganizationTable = (query, DataTypes) =>
  query.createTable('authOrganization', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    organizationId: {
      type: DataTypes.INTEGER
    },
    slug: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    pictureUrl: {
      type: DataTypes.STRING
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

export default {
  // we don't care about data migration because at the time of migration
  // the feature behind `authOrganization` are not really used
  up: (query, DataTypes) => Promise.all([
    createTableOrganization(query, DataTypes),
    query.dropTable('authOrganization')
  ]),
  down: (query, DataTypes) => Promise.all([
    query.dropTable('organization'),
    recreateAuthOrganizationTable(query, DataTypes)
  ])
};
